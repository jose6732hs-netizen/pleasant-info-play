import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUserStatus, updateUserRole, deleteUser, User } from "@/lib/users.functions";
import { toast } from "sonner";
import { 
  UserPlus, 
  Shield, 
  User as UserIcon, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Trash2,
  Mail,
  Calendar,
  Clock,
  Search,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/usuarios")({
  component: UsuariosPage,
});

function UsuariosPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: "", email: "", role: "USER" as const });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof newUserData) => createUser({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsModalOpen(false);
      setNewUserData({ name: "", email: "", role: "USER" });
      toast.success("Usuário criado com sucesso");
    },
    onError: (err: any) => toast.error(err.message || "Erro ao criar usuário")
  });

  const statusMutation = useMutation({
    mutationFn: (data: { id: string; status: 'ACTIVE' | 'BLOCKED' }) => updateUserStatus({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Status atualizado");
    }
  });

  const roleMutation = useMutation({
    mutationFn: (data: { id: string; role: 'ADMIN' | 'USER' }) => updateUserRole({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Permissão atualizada");
    }
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Gestão de <span className="text-neutral-500">Usuários</span>
          </h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">Segurança & Controle de Acessos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Novo Usuário
        </button>
      </header>

      {/* Filters */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
        <input 
          type="text" 
          placeholder="PESQUISAR POR NOME OU E-MAIL..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-white transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Criado em</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-black border border-white/10">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-widest">{user.name}</div>
                        <div className="text-[9px] text-neutral-500 font-bold flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => roleMutation.mutate({ id: user.id, role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                      className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border transition ${
                        user.role === 'ADMIN' 
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' 
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                      {user.role}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] ${
                      user.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {user.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => statusMutation.mutate({ id: user.id, status: user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' })}
                        title={user.status === 'ACTIVE' ? 'Bloquear' : 'Ativar'}
                        className="p-2 hover:bg-white/10 rounded-sm text-neutral-400 transition"
                      >
                        {user.status === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este usuário?')) {
                            deleteUser({ data: { id: user.id } }).then(() => queryClient.invalidateQueries({ queryKey: ["admin-users"] }));
                          }
                        }}
                        className="p-2 hover:bg-red-500/20 text-red-900 hover:text-red-500 rounded-sm transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-sm space-y-6">
            <h2 className="text-xl font-black uppercase tracking-widest italic">Novo Usuário do Sistema</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Nome Completo</label>
                <input 
                  type="text" 
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full bg-black border border-white/10 p-3 text-sm focus:border-white outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">E-mail</label>
                <input 
                  type="email" 
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full bg-black border border-white/10 p-3 text-sm focus:border-white outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Função</label>
                <select 
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value as any})}
                  className="w-full bg-black border border-white/10 p-3 text-sm focus:border-white outline-none transition uppercase font-black"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={() => createMutation.mutate(newUserData)}
                disabled={createMutation.isPending}
                className="flex-1 bg-white text-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition"
              >
                Criar Acesso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
