"use client";

import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  Command,
  FolderKanban,
  House,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PackageCheck,
  Plus,
  Search,
  Settings,
  Users,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import { NasaqMark } from "@nasaq/ui";
import { switchLocaleInPath, type Dictionary } from "@nasaq/i18n";
import type { Locale } from "@nasaq/contracts";

type NavItem = {
  key: keyof Dictionary["nav"];
  href: string;
  icon: typeof House;
  badge?: number;
};

export function AppShell({ children, locale, dictionary, workspaceName }: { children: ReactNode; locale: Locale; dictionary: Dictionary; workspaceName: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const base = `/${locale}/app`;
  const mainNav: NavItem[] = [
    { key: "home", href: `${base}/home`, icon: House },
    { key: "chat", href: `${base}/chat`, icon: MessageSquareText },
    { key: "projects", href: `${base}/projects`, icon: FolderKanban },
    { key: "agents", href: `${base}/agents`, icon: Bot },
    { key: "flows", href: `${base}/flows`, icon: Workflow },
    { key: "knowledge", href: `${base}/knowledge`, icon: BookOpen },
  ];
  const operationNav: NavItem[] = [
    { key: "runs", href: `${base}/runs`, icon: Activity, badge: 1 },
  ];
  const manageNav: NavItem[] = [
    { key: "models", href: `${base}/models`, icon: Boxes },
    { key: "tools", href: `${base}/tools`, icon: Wrench },
    { key: "skills", href: `${base}/skills`, icon: PackageCheck },
    { key: "usage", href: `${base}/usage`, icon: ChartNoAxesCombined },
    { key: "team", href: `${base}/team`, icon: Users },
    { key: "settings", href: `${base}/settings`, icon: Settings },
  ];
  const allNav = [...mainNav, ...operationNav, ...manageNav];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const current = allNav.find((item) => isActive(item.href));
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const alternatePath = switchLocaleInPath(pathname, alternateLocale);
  const groupLabel = locale === "ar" ? { work: "مساحة العمل", operations: "التشغيل", manage: "الإدارة" } : { work: "Workspace", operations: "Operations", manage: "Manage" };

  const normalizedCommandQuery = commandQuery.trim().toLocaleLowerCase(locale);
  const filteredCommands = normalizedCommandQuery
    ? allNav.filter((item) => dictionary.nav[item.key].toLocaleLowerCase(locale).includes(normalizedCommandQuery))
    : allNav;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
        setWorkspaceOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      window.localStorage.setItem("nasaq.sidebar.collapsed", String(next));
      return next;
    });
  }

  function closeTransient() {
    setMobileOpen(false);
    setCommandOpen(false);
    setNotificationsOpen(false);
    setWorkspaceOpen(false);
  }

  function NavLink({ item }: { item: NavItem }) {
    const Icon = item.icon;
    return (
      <Link href={item.href} className={`nav-item${isActive(item.href) ? " is-active" : ""}`} onClick={closeTransient} title={collapsed ? dictionary.nav[item.key] : undefined}>
        <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
        <span className="nav-text">{dictionary.nav[item.key]}</span>
        {item.badge ? <span className="nav-badge" aria-label={`${item.badge}`}>{item.badge}</span> : null}
      </Link>
    );
  }

  return (
    <Dialog.Root open={commandOpen} onOpenChange={setCommandOpen}>
      <div className="app-root" data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      <a className="skip-link" href="#main-content">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      {mobileOpen ? <button className="mobile-backdrop" aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"} onClick={() => setMobileOpen(false)} /> : null}
      <aside className="app-sidebar" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
        <div className="app-sidebar__brand">
          <NasaqMark size={35} />
          <strong className="brand-word">{dictionary.brand.name}</strong>
          <button className="mobile-sidebar-close" type="button" onClick={() => setMobileOpen(false)} aria-label={locale === "ar" ? "إغلاق التنقل" : "Close navigation"}><X size={18} /></button>
        </div>

        <button className="app-sidebar__workspace" type="button" onClick={() => setWorkspaceOpen((value) => !value)} aria-expanded={workspaceOpen}>
          <span className="workspace-avatar">أ</span>
          <span className="workspace-copy">
            <span>{dictionary.common.workspace}</span>
            <strong>{workspaceName}</strong>
          </span>
          <ChevronDown className="workspace-chevron" size={14} aria-hidden="true" />
        </button>
        {workspaceOpen ? (
          <div className="sidebar-popover workspace-popover">
            <p>{locale === "ar" ? "مساحاتك" : "Your workspaces"}</p>
            <button type="button" className="workspace-option" onClick={() => setWorkspaceOpen(false)}><span className="workspace-avatar">أ</span><span>{workspaceName}</span><Check size={14} /></button>
            <button type="button" className="workspace-option" onClick={() => setWorkspaceOpen(false)}><span className="workspace-avatar workspace-avatar--muted">ش</span><span>{locale === "ar" ? "مساحتي الشخصية" : "Personal workspace"}</span></button>
            <Link href={`${base}/settings`} onClick={closeTransient}><Plus size={14} />{locale === "ar" ? "إدارة المساحات" : "Manage workspaces"}</Link>
          </div>
        ) : null}

        <nav className="app-nav">
          <div className="nav-group">
            <p className="nav-label">{groupLabel.work}</p>
            {mainNav.map((item) => <NavLink item={item} key={item.key} />)}
          </div>
          <div className="nav-group">
            <p className="nav-label">{groupLabel.operations}</p>
            {operationNav.map((item) => <NavLink item={item} key={item.key} />)}
          </div>
          <div className="nav-group">
            <p className="nav-label">{groupLabel.manage}</p>
            {manageNav.map((item) => <NavLink item={item} key={item.key} />)}
          </div>
        </nav>
        <div className="app-sidebar__bottom">
          <button type="button" className="collapse-button" onClick={toggleCollapsed} aria-label={collapsed ? dictionary.common.expand : dictionary.common.collapse}>
            <PanelLeftClose size={17} />
            <span className="collapse-text">{collapsed ? dictionary.common.expand : dictionary.common.collapse}</span>
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-context">
            <button className="icon-button mobile-menu-button" type="button" onClick={() => setMobileOpen(true)} aria-label={dictionary.common.openMenu}><Menu size={19} /></button>
            <span>{workspaceName}</span><ChevronRight size={13} aria-hidden="true" /><strong>{current ? dictionary.nav[current.key] : dictionary.nav.home}</strong>
          </div>
          <Dialog.Trigger asChild>
            <button className="command-trigger" type="button">
              <Search size={15} aria-hidden="true" /><span>{dictionary.common.search}</span><kbd>⌘ K</kbd>
            </button>
          </Dialog.Trigger>
          <div className="topbar-actions">
            <span className="demo-indicator">{dictionary.brand.demo}</span>
            <Link className="locale-link" href={alternatePath} aria-label={locale === "ar" ? "التبديل إلى الإنجليزية" : "Switch to Arabic"}>{alternateLocale.toUpperCase()}</Link>
            <button className="icon-button" type="button" onClick={() => setNotificationsOpen((value) => !value)} aria-label={dictionary.common.notifications} aria-expanded={notificationsOpen}><Bell size={17} /><span className="notification-dot" /></button>
            <button className="profile-button" type="button" aria-label={locale === "ar" ? "حساب سارة" : "Sarah’s account"}>س</button>
          </div>
        </header>

        {notificationsOpen ? (
          <aside className="topbar-popover notifications-panel" aria-label={dictionary.common.notifications}>
            <div className="popover-heading"><strong>{dictionary.common.notifications}</strong><button className="icon-button" type="button" onClick={() => setNotificationsOpen(false)} aria-label={locale === "ar" ? "إغلاق الإشعارات" : "Close notifications"}><X size={16} /></button></div>
            <Link href={`${base}/runs`} onClick={closeTransient} className="notification-item notification-item--attention"><span className="notification-symbol"><Bell size={15} /></span><span><strong>{locale === "ar" ? "موافقة مطلوبة" : "Approval required"}</strong><small>{locale === "ar" ? "إرسال ملخص الرصد إلى فريق المشروع" : "Send the monitoring digest to the project team"}</small></span></Link>
            <Link href={`${base}/runs`} onClick={closeTransient} className="notification-item"><span className="notification-symbol"><Check size={15} /></span><span><strong>{locale === "ar" ? "اكتمل تقرير" : "Report completed"}</strong><small>{locale === "ar" ? "مراجعة مصادر تقرير الإطلاق" : "Launch report source review"}</small></span></Link>
          </aside>
        ) : null}

        <main id="main-content" className="app-content">{children}</main>
      </div>

      <nav className="mobile-nav" aria-label={locale === "ar" ? "التنقل على الهاتف" : "Mobile navigation"}>
        {mainNav.slice(0, 3).map((item) => { const Icon = item.icon; return <Link key={item.key} href={item.href} className={isActive(item.href) ? "is-active" : ""}><Icon size={18} /><span>{dictionary.nav[item.key]}</span></Link>; })}
        <Link href={`${base}/runs`} className={isActive(`${base}/runs`) ? "is-active" : ""}><Activity size={18} /><span>{dictionary.nav.runs}</span></Link>
        <button type="button" onClick={() => setMobileOpen(true)}><Menu size={18} /><span>{locale === "ar" ? "المزيد" : "More"}</span></button>
      </nav>

      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="command-overlay" />
        <Dialog.Content className="command-dialog" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">{dictionary.common.search}</Dialog.Title>
          <div className="command-input-wrap">
            <Search size={18} aria-hidden="true" />
            <input autoFocus value={commandQuery} onChange={(event) => setCommandQuery(event.target.value)} placeholder={dictionary.common.search} aria-label={dictionary.common.search} />
            <Dialog.Close asChild>
              <button className="icon-button" type="button" aria-label={locale === "ar" ? "إغلاق لوحة الأوامر" : "Close command palette"}><X size={17} /></button>
            </Dialog.Close>
          </div>
          <div className="command-results">
            <p>{locale === "ar" ? "انتقل إلى" : "Go to"}</p>
            {filteredCommands.length ? filteredCommands.map((item) => { const Icon = item.icon; return <Link key={item.key} href={item.href} onClick={closeTransient}><Icon size={16} /><span>{dictionary.nav[item.key]}</span><Command size={12} /></Link>; }) : <div className="command-empty">{locale === "ar" ? "لا توجد نتيجة مطابقة" : "No matching result"}</div>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
