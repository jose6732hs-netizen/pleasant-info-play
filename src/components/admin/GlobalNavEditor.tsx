import React from 'react';
import { GripVertical, Eye, EyeOff, Plus, Trash2, Link as LinkIcon, MessageSquare, MapPin, Phone, Mail, Instagram, Youtube, Facebook, Chrome, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface NavLink {
  id: string;
  label: string;
  url: string;
  active: boolean;
  order: number;
}

interface FooterBlock {
  id: string;
  name: string;
  active: boolean;
  order: number;
}

interface GlobalNavConfig {
  menu: {
    logo: string;
    links: NavLink[];
    showBookingButton: boolean;
    bookingButtonText: string;
    bookingButtonUrl: string;
  };
  footer: {
    logo: string;
    description: string;
    blocks: FooterBlock[];
    social: {
      instagram: string;
      youtube: string;
      facebook: string;
      tiktok: string;
    };
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    copyright: string;
  };
}

interface GlobalNavEditorProps {
  value: GlobalNavConfig;
  onChange: (value: GlobalNavConfig) => void;
}

function SortableNavLinkItem({ link, onToggle, onDelete, onChange }: { 
  link: NavLink; 
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, updates: Partial<NavLink>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-3 p-4 bg-black/40 border rounded-sm transition-all",
        isDragging ? "border-blue-500 bg-white/5 scale-[1.02] shadow-2xl" : "border-white/5 hover:border-white/10",
        !link.active && "opacity-50"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-white transition"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <Input 
            value={link.label} 
            onChange={(e) => onChange(link.id, { label: e.target.value })}
            placeholder="Label do Link"
            className="h-8 text-[10px] bg-black border-white/10 uppercase font-bold tracking-widest"
          />
          <Input 
            value={link.url} 
            onChange={(e) => onChange(link.id, { url: e.target.value })}
            placeholder="URL (ex: /artistas)"
            className="h-8 text-[10px] bg-black border-white/10 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch 
            checked={link.active} 
            onCheckedChange={() => onToggle(link.id)}
          />
          <button 
            onClick={() => onDelete(link.id)}
            className="p-2 hover:bg-red-500/20 text-neutral-500 hover:text-red-500 rounded-sm transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function GlobalNavEditor({ value, onChange }: GlobalNavEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndLinks = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = value.menu.links.findIndex((l) => l.id === active.id);
    const newIndex = value.menu.links.findIndex((l) => l.id === over.id);

    const newLinks = arrayMove(value.menu.links, oldIndex, newIndex).map((l, i) => ({
      ...l,
      order: i
    }));

    onChange({ ...value, menu: { ...value.menu, links: newLinks } });
  };

  const addLink = () => {
    const newLink: NavLink = {
      id: `link-${Date.now()}`,
      label: 'NOVO LINK',
      url: '/',
      active: true,
      order: value.menu.links.length
    };
    onChange({ 
      ...value, 
      menu: { ...value.menu, links: [...value.menu.links, newLink] } 
    });
  };

  const updateLink = (id: string, updates: Partial<NavLink>) => {
    const newLinks = value.menu.links.map(l => l.id === id ? { ...l, ...updates } : l);
    onChange({ ...value, menu: { ...value.menu, links: newLinks } });
  };

  const deleteLink = (id: string) => {
    const newLinks = value.menu.links.filter(l => l.id !== id);
    onChange({ ...value, menu: { ...value.menu, links: newLinks } });
  };

  const toggleLink = (id: string) => {
    const newLinks = value.menu.links.map(l => l.id === id ? { ...l, active: !l.active } : l);
    onChange({ ...value, menu: { ...value.menu, links: newLinks } });
  };

  return (
    <div className="space-y-8">
      <Accordion type="single" collapsible className="space-y-4">
        {/* MENU / HEADER */}
        <AccordionItem value="menu" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-4 h-4 text-blue-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Menu Principal</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Navegação e Brand Superior</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-widest text-neutral-400">URL do Logo (Metallic)</Label>
              <Input 
                value={value.menu.logo} 
                onChange={(e) => onChange({ ...value, menu: { ...value.menu, logo: e.target.value } })}
                className="bg-black border-white/10 text-xs"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Links de Navegação</Label>
                <Button variant="outline" size="sm" onClick={addLink} className="h-7 text-[9px] uppercase tracking-widest border-white/10">
                  <Plus className="w-3 h-3 mr-1" /> Add Link
                </Button>
              </div>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndLinks}
              >
                <SortableContext
                  items={value.menu.links.map(l => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {value.menu.links.map((link) => (
                      <SortableNavLinkItem 
                        key={link.id} 
                        link={link} 
                        onToggle={toggleLink} 
                        onDelete={deleteLink}
                        onChange={updateLink}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-sm">
                <Label className="text-[9px] uppercase tracking-widest text-neutral-300">Mostrar Botão de Contratação</Label>
                <Switch 
                  checked={value.menu.showBookingButton} 
                  onCheckedChange={(v) => onChange({ ...value, menu: { ...value.menu, showBookingButton: v } })}
                />
              </div>
              {value.menu.showBookingButton && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label className="text-[8px] uppercase tracking-widest text-neutral-500">Texto do Botão</Label>
                    <Input 
                      value={value.menu.bookingButtonText} 
                      onChange={(e) => onChange({ ...value, menu: { ...value.menu, bookingButtonText: e.target.value } })}
                      className="bg-black border-white/10 text-[10px] uppercase font-bold tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[8px] uppercase tracking-widest text-neutral-500">Link / Destino</Label>
                    <Input 
                      value={value.menu.bookingButtonUrl} 
                      onChange={(e) => onChange({ ...value, menu: { ...value.menu, bookingButtonUrl: e.target.value } })}
                      className="bg-black border-white/10 text-[10px] font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* FOOTER / RODAPÉ */}
        <AccordionItem value="footer" className="border border-white/5 bg-black/20 px-6 rounded-sm">
          <AccordionTrigger className="hover:no-underline py-6">
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-purple-500" />
              <div className="text-left">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Rodapé (Footer)</h4>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Brand, Contato e Copyright</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Logo do Rodapé</Label>
                  <Input 
                    value={value.footer.logo} 
                    onChange={(e) => onChange({ ...value, footer: { ...value.footer, logo: e.target.value } })}
                    className="bg-black border-white/10 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Descrição Brand</Label>
                  <Textarea 
                    value={value.footer.description} 
                    onChange={(e) => onChange({ ...value, footer: { ...value.footer, description: e.target.value } })}
                    className="bg-black border-white/10 text-xs min-h-[80px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                 <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Visibilidade de Blocos</Label>
                 <div className="space-y-2">
                    {value.footer.blocks.map((block) => (
                      <div key={block.id} className="flex items-center justify-between p-2 bg-black/40 rounded-sm border border-white/5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">{block.name}</span>
                        <Switch 
                          checked={block.active} 
                          onCheckedChange={(v) => {
                            const newBlocks = value.footer.blocks.map(b => b.id === block.id ? { ...b, active: v } : b);
                            onChange({ ...value, footer: { ...value.footer, blocks: newBlocks } });
                          }}
                        />
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <Phone className="w-3 h-3 text-green-500" /> Informações de Contato
                    </h5>
                    <div className="space-y-3">
                      <Input 
                        value={value.footer.contact.email} 
                        onChange={(e) => onChange({ ...value, footer: { ...value.footer, contact: { ...value.footer.contact, email: e.target.value } } })}
                        placeholder="Email"
                        className="bg-black border-white/10 text-[10px]"
                      />
                      <Input 
                        value={value.footer.contact.phone} 
                        onChange={(e) => onChange({ ...value, footer: { ...value.footer, contact: { ...value.footer.contact, phone: e.target.value } } })}
                        placeholder="Telefone"
                        className="bg-black border-white/10 text-[10px]"
                      />
                      <Input 
                        value={value.footer.contact.address} 
                        onChange={(e) => onChange({ ...value, footer: { ...value.footer, contact: { ...value.footer.contact, address: e.target.value } } })}
                        placeholder="Endereço"
                        className="bg-black border-white/10 text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <Instagram className="w-3 h-3 text-pink-500" /> Redes Sociais
                    </h5>
                    <div className="space-y-3">
                      <Input 
                        value={value.footer.social.instagram} 
                        onChange={(e) => onChange({ ...value, footer: { ...value.footer, social: { ...value.footer.social, instagram: e.target.value } } })}
                        placeholder="URL Instagram"
                        className="bg-black border-white/10 text-[10px]"
                      />
                      <Input 
                        value={value.footer.social.youtube} 
                        onChange={(e) => onChange({ ...value, footer: { ...value.footer, social: { ...value.footer.social, youtube: e.target.value } } })}
                        placeholder="URL YouTube"
                        className="bg-black border-white/10 text-[10px]"
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-neutral-400">Texto de Copyright</Label>
                  <Input 
                    value={value.footer.copyright} 
                    onChange={(e) => onChange({ ...value, footer: { ...value.footer, copyright: e.target.value } })}
                    className="bg-black border-white/10 text-[9px] uppercase tracking-widest"
                  />
               </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}