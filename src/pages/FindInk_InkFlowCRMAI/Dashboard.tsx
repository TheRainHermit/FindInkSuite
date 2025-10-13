import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Clientes Activos",
    value: "142",
    change: "+12%",
    icon: Users,
    gradient: "from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))]",
  },
  {
    title: "Citas Este Mes",
    value: "38",
    change: "+8%",
    icon: Calendar,
    gradient: "from-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))]",
  },
  {
    title: "Ingresos Mensuales",
    value: "$12,450",
    change: "+23%",
    icon: DollarSign,
    gradient: "from-[hsl(var(--ink-magenta))] to-[hsl(var(--ink-purple))]",
  },
  {
    title: "Tasa de Conversión",
    value: "68%",
    change: "+5%",
    icon: TrendingUp,
    gradient: "from-[hsl(var(--ink-purple))] via-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))]",
  },
];

const recentClients = [
  { name: "María González", tattoo: "Rosa realista", date: "Hoy, 2:00 PM", status: "confirmed" },
  { name: "Carlos Ruiz", tattoo: "Diseño geométrico", date: "Mañana, 10:00 AM", status: "pending" },
  { name: "Ana López", tattoo: "Lettering minimalista", date: "23 Oct, 4:00 PM", status: "confirmed" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--ink-purple))] via-[hsl(var(--ink-cyan))] to-[hsl(var(--ink-magenta))] bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Resumen de tu estudio de tatuaje</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-[hsl(var(--ink-purple)/0.5)] hover:shadow-[0_0_30px_hsl(var(--ink-purple)/0.2)]"
            >
              <div className={`absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-[hsl(var(--ink-cyan))] mt-1">
                  {stat.change} vs mes anterior
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-[hsl(var(--ink-purple)/0.3)] transition-all"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.tattoo}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm">{client.date}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        client.status === "confirmed"
                          ? "bg-[hsl(var(--ink-cyan)/0.2)] text-[hsl(var(--ink-cyan))]"
                          : "bg-[hsl(var(--ink-magenta)/0.2)] text-[hsl(var(--ink-magenta))]"
                      }`}
                    >
                      {client.status === "confirmed" ? "Confirmada" : "Pendiente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ink-purple)/0.1)] via-transparent to-[hsl(var(--ink-cyan)/0.1)]" />
          <CardHeader>
            <CardTitle className="text-xl">Asistente AI</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-[hsl(var(--ink-purple)/0.2)] to-[hsl(var(--ink-cyan)/0.2)] border border-[hsl(var(--ink-purple)/0.3)]">
                <p className="text-sm mb-2 text-muted-foreground">Sugerencia del día:</p>
                <p className="font-medium">
                  Tienes 3 clientes que no han confirmado su cita. ¿Quieres que les envíe un recordatorio?
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[hsl(var(--ink-purple))] to-[hsl(var(--ink-cyan))] hover:opacity-90 transition-all font-medium">
                  Enviar recordatorios
                </button>
                <button className="px-4 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-all">
                  Más tarde
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
