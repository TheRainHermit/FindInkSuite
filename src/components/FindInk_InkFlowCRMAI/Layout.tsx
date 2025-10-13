import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Calendar, Sparkles, Image, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import HomeHeader from "../HomeHeader";

const navItems = [
	{ icon: LayoutDashboard, label: "Dashboard", path: "/crm" },
	{ icon: Users, label: "Clientes", path: "/crm/clients" },
	{ icon: Calendar, label: "Calendario", path: "/crm/calendar" },
	{ icon: Sparkles, label: "Asistente AI", path: "/crm/assistant" },
	{ icon: User, label: "Tatuadores", path: "/crm/artists" },
];

const Layout = () => {
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div
			className="min-h-screen"
			style={{
				background: "hsl(var(--background))",
				color: "hsl(var(--foreground))",
				transition: "var(--transition-smooth)",
			}}
		>
            <HomeHeader />
			{/* Sidebar Desktop */}
			<aside
				className="fixed rounded-xl left-0 z-10 h-screen w-64 border-r border-border bg-card lg:block"
				style={{
					borderColor: "hsl(var(--border))",
					boxShadow: "var(--shadow-neon-primary)",
                    top: "4.6rem",
				}}
			>
				<div className="flex h-full flex-col gap-2 ">
					<div className="flex h-16 items-center border-b border-border px-6">
						<div className="flex items-center gap-3">
							<div>                              
								<h1 className="text-lg font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
									InkFlow CRM AI
								</h1>
							</div>
						</div>
					</div>
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.path;
							return (
								<Link key={item.path} to={item.path}>
									<Button
										variant={isActive ? "secondary" : "ghost"}
										className={cn(
											"w-full justify-start gap-3 transition-all",
											isActive &&
												"bg-gradient-to-r from-[hsl(var(--primary)/0.3)] to-[hsl(var(--secondary)/0.3)] border border-[hsl(var(--primary)/0.1)] shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
										)}
									>
										<Icon
											className={cn(
												"h-5 w-5",
												isActive && "text-[hsl(var(--secondary))]"
											)}
										/>
										<span>{item.label}</span>
									</Button>
								</Link>
							);
						})}
					</nav>
				</div>
			</aside>

			{/* Mobile Header */}
			<header
				className="fixed top-20 left-0 right-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur lg:hidden"
				style={{
					borderColor: "hsl(var(--border))",
					background: "hsl(var(--card), 0.95)",
				}}
			>
				<div className="flex h-full items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<h1 className="text-base font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
							InkFlow CRM
						</h1>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			</header>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div
					className="fixed inset-0 z-20 bg-background/95 backdrop-blur pt-16 lg:hidden"
					style={{
						background: "hsl(var(--background), 0.95)",
					}}
				>
					<nav className="space-y-1 p-4">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.path;
							return (
								<Link
									key={item.path}
									to={item.path}
									onClick={() => setMobileMenuOpen(false)}
								>
									<Button
										variant={isActive ? "secondary" : "ghost"}
										className={cn(
											"w-full justify-start gap-3",
											isActive &&
												"bg-gradient-to-r from-[hsl(var(--primary)/0.2)] to-[hsl(var(--secondary)/0.1)] shadow-[0_0_8px_hsl(var(--primary)/0.3)]"
										)}
									>
										<Icon className="h-5 w-5" />
										<span>{item.label}</span>
									</Button>
								</Link>
							);
						})}
					</nav>
				</div>
			)}

			{/* Main Content */}
			<main className="lg:pl-64 pt-[4.6rem] lg:pt-[4.6rem]">
				<div
					className="p-4 lg:p-8 rounded-xl shadow-xl z-20"
					style={{
						background: "hsl(var(--card), 0.98)",
						boxShadow: "var(--shadow-neon-primary)",
					}}
				>
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default Layout;
