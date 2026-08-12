import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, AuditLog } from "@/lib/audit.functions";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  Activity,
  AlertCircle,
  ExternalLink,
  Lock,
  Unlock,
  UserPlus,
  Key,
  LogOut
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/seguranca/auditoria")({
  component: AuditPage,
});

const getEventIcon = (type: string) => {
  switch (type) {
    case 'LOGIN_SUCCESS': return <ShieldCheck className="w-4 h-4 text-green-500" />;
    case 'LOGIN_FAILURE': return <ShieldAlert className="w-4 h-4 text-red-500" />;
    case 'LOGOUT': return <LogOut className="w-4 h-4 text-neutral-400" />;
    case 'USER_CREATED': return <UserPlus className="w-4 h-4 text-blue-500" />;
    case 'USER_BLOCKED': return <Lock className="w-4 h-4 text-red-500" />;
    case 'USER_UNBLOCKED': return <Unlock className="w-4 h-4 text-green-500" />;
    case 'PASSWORD_RESET_SUCCESS': return <Key className="w-4 h-4 text-yellow-500" />;
    default: return <Activity className="w-4 h-4 text-neutral-500" />;
  }
};

function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => getAuditLogs(),
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Auditoria <span className="text-neutral-500">& Segurança</span>
          </h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">Log de Atividade Administrativa Realtime</p>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input 
            type="text" 
            placeholder="PESQUISAR LOGS (EMAIL, EVENTO)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-white transition"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-[9px] font-black uppercase tracking-widest outline-none focus:border-white transition"
          >
            <option value="ALL">TODOS OS EVENTOS</option>
            <option value="LOGIN_SUCCESS">LOGINS BEM SUCEDIDOS</option>
            <option value="LOGIN_FAILURE">FALHAS DE LOGIN</option>
            <option value="USER_CREATED">NOVOS USUÁRIOS</option>
            <option value="USER_BLOCKED">BLOQUEIOS</option>
          </select>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">IP</th>
                <th className="px-6 py-4">Resultado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-800 rounded-sm border border-white/5">
                        {getEventIcon(log.type)}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{log.type.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-neutral-600" />
                      <span className="text-[10px] font-bold text-neutral-300">{log.userEmail || 'SISTEMA'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <div className="text-[10px] font-black uppercase flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-neutral-600" />
                        {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-[9px] text-neutral-500 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-neutral-700" />
                        {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-mono text-neutral-600">{log.ip}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      log.result === 'SUCCESS' 
                        ? 'border-green-500/20 bg-green-500/10 text-green-500' 
                        : 'border-red-500/20 bg-red-500/10 text-red-500'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-sm text-neutral-500 hover:text-white transition">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-8 h-8 text-neutral-800" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700">Nenhum evento registrado no período</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
