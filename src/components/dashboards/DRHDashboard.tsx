import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GARES } from '@/constants';
import { 
  Users, 
  MapPin, 
  ArrowLeft,
  Search,
  User,
  Clock,
  Calendar,
  FileText,
  BadgeCheck,
  Building2,
  Building,
  Warehouse,
  Briefcase,
  Phone,
  Mail,
  MoreVertical,
  QrCode,
  UserPlus,
  Trash2,
  Plus,
  Wrench,
  Camera,
  Image as ImageIcon,
  Upload,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/AuthProvider';
import { UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Types ---
interface Employee {
  id: string;
  matricule: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  gare_id: string;
  service: string;
  status: string;
  phone: string;
  email: string;
  photo_url: string;
  date_embauche: string;
  sexe?: string;
  adresse?: string;
  cni_number?: string;
  permis_number?: string;
}

interface Gare {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface DRHDashboardProps {
  initialTab?: 'personnel' | 'absences' | 'gares' | 'technique' | 'administration';
}

const allGaresList = GARES;

const allRoles = [
  'PDG', 'DG', 'Directeur de Gare', 'Chef de Gare', 'Chef de Gare Adjoint', 'Chauffeur', 
  'Pompiste', 'Directeur des Réssources Humaines', 'Directeur des Affaires Financiere', 
  'Comptable', 'Responsable courrier', 'Bagagiste', 'Enregistreur', 
  'Controleur', 'Convoyeur', 'Chargeur', 'Chef bagagiste', 
  'Conseiller', 'Guichetier', 'Assistant guichet'
];

// --- Components ---

import { Logo } from '@/components/Logo';

const ProfessionalCard = ({ employee, open, onOpenChange, onDelete, onEdit }: { 
  employee: Employee | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onDelete?: (id: string) => void,
  onEdit?: (employee: Employee) => void
}) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] p-0 overflow-hidden border-none bg-white rounded-none shadow-2xl max-h-[95vh]">
        <ScrollArea className="h-full max-h-[95vh]">
          <div className="relative w-full flex flex-col bg-white overflow-hidden border-4 border-slate-100 min-h-[600px]">
            {/* Header Section with Diagonal Split */}
            <div className="relative h-[140px] w-full overflow-hidden">
              {/* The Blue Diagonal Shape - Adjusted clip-path for better look */}
              <div 
                className="absolute inset-0 bg-[#00408B]" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 100%)' }}
              />
              
              <div className="relative z-10 p-5 flex items-start gap-4">
                <Logo size="md" showText={false} className="shadow-2xl border-white" />
                
                <div className="flex flex-col">
                  <h1 className="text-3xl font-black text-white tracking-tighter leading-none">DBS-BAN</h1>
                  <p className="text-white text-[10px] font-bold tracking-widest mt-2 opacity-90">DIOMANDÉ BAN SERVICE</p>
                </div>
              </div>
            </div>

            {/* Portrait Section */}
            <div className="relative h-[160px] flex items-center justify-center mt-[-35px]">
              {/* Blue Rings Background */}
              <div className="absolute w-44 h-44 rounded-full border-[10px] border-[#00AEEF]/10 translate-x-1" />
              <div className="absolute w-36 h-36 rounded-full border-[8px] border-[#00AEEF]/20 -translate-x-1" />
              
              {/* Main Avatar */}
              <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-50 z-10 ring-1 ring-slate-100">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={employee.photo_url} className="object-cover" />
                  <AvatarFallback className="text-4xl font-black text-[#00408B] bg-slate-100">
                    {employee.last_name[0]}{employee.first_name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

            </div>

            {/* Info Section */}
            <div className="px-10 py-5 space-y-3">
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Nom</span>
                <span className="text-xl font-black text-[#00408B] leading-none uppercase truncate">: {employee.last_name}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Prénom</span>
                <span className="text-xl font-black text-[#00408B] leading-none uppercase truncate">: {employee.first_name}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Fonction</span>
                <span className="text-xl font-black text-red-600 leading-none uppercase truncate">: {employee.role}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Domicile</span>
                <span className="text-xl font-black text-[#00408B] leading-none capitalize truncate">: {employee.adresse || employee.gare_id || 'Abidjan'}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Contacte</span>
                <span className="text-xl font-black text-[#00408B] leading-none truncate">: {employee.phone || '00 00 00 00 00'}</span>
              </div>

              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Email</span>
                <span className="text-[13px] font-black text-[#00408B] leading-none truncate">: {employee.email || 'N/A'}</span>
              </div>

              {/* Extra info for completeness since user said "all information" */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Matricule</span>
                  <span className="text-sm font-mono font-black text-[#00408B]">{employee.matricule}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Embauche</span>
                  <span className="text-sm font-black text-slate-600">{new Date(employee.date_embauche).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Gare d'attache</span>
                  <span className="text-sm font-black text-slate-600 uppercase">{employee.gare_id || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Service</span>
                  <span className="text-sm font-black text-slate-600 uppercase">{employee.service || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Bus Graphic */}
            <div className="px-6 pb-2 mt-auto">
              <div className="relative h-16 w-full opacity-80 overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400" 
                  alt="Bus" 
                  className="w-full h-full object-cover scale-x-[-1] brightness-110 contrast-110 mix-blend-multiply" 
                />
                <div className="absolute right-4 bottom-2 text-[10px] font-black text-[#00408B] bg-white/40 px-1 rounded">DBS</div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="bg-[#E31E24] py-3 w-full shrink-0">
              <h3 className="text-center text-white text-2xl font-black tracking-[0.05em] uppercase">
                CARTE PROFESSIONNELLE
              </h3>
            </div>
          </div>
        </ScrollArea>

        {/* Action buttons (fixed overlay) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm text-[#00408B] hover:bg-white h-9 w-9"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {onEdit && (
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white h-9 w-9"
              onClick={() => onEdit(employee)}
            >
              <Briefcase className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              size="icon" 
              variant="destructive" 
              className="rounded-full shadow-lg h-9 w-9"
              onClick={() => onDelete(employee.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function DRHDashboard({ initialTab = 'personnel' }: DRHDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedGare, setSelectedGare] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: '',
    assignment: '',
    gare_id: '',
    phone: '',
    email: '',
    sexe: '',
    adresse: '',
    cni_number: '',
    permis_number: ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedGare(null);
  }, [initialTab]);

  const fetchData = async () => {
    try {
      const { data: empsData } = await supabase.from('employees').select('*');
      setEmployees(empsData || []);
    } catch (error) {
      console.error('Error fetching personnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.last_name.trim()) errors.last_name = "Le nom est obligatoire";
    if (!formData.first_name.trim()) errors.first_name = "Le prénom est obligatoire";
    if (!formData.role) errors.role = "La fonction est obligatoire";
    if (!formData.assignment) errors.assignment = "L'assignation est obligatoire";
    if (formData.assignment === 'gare' && !formData.gare_id) errors.gare_id = "Veuillez choisir une gare";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }

    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = "Format de téléphone invalide";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setSaving(true);
    try {
      const full_name = `${formData.last_name} ${formData.first_name}`;
      let photo_url = photoPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${full_name}`;
      
      // Removed Supabase storage upload logic for prototype stability
      // (Using base64 from photoPreview which is more reliable in this preview environment)

      const serviceValue = formData.assignment === 'administration' ? 'Administration' : 
                         formData.assignment === 'technique' ? 'Service Technique' : 'Gare';
      
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      const randomDigits = Math.floor(10 + Math.random() * 90).toString();
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const autoMatricule = `DBS-${yearSuffix}${randomDigits}${randomLetter}`;

      const newEmployee = {
        matricule: autoMatricule,
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: full_name,
        role: formData.role,
        gare_id: formData.gare_id || null,
        service: serviceValue,
        phone: formData.phone || null,
        email: formData.email || null,
        sexe: formData.sexe || null,
        adresse: formData.adresse || null,
        cni_number: formData.cni_number || null,
        permis_number: formData.permis_number || null,
        date_embauche: new Date().toISOString().split('T')[0],
        status: 'active',
        photo_url
      };

      const { data, error } = await supabase.from('employees').insert([newEmployee]).select();
      
      if (error) throw error;
      
      toast.success("Employé ajouté avec succès");
      setEmployees([...employees, data[0]]);
      setIsAddDialogOpen(false);
      setFormData({ 
        first_name: '', last_name: '', role: '', assignment: '', 
        gare_id: '', phone: '', email: '',
        sexe: '', adresse: '', cni_number: '', permis_number: ''
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setSaving(true);
    try {
      const full_name = `${formData.last_name} ${formData.first_name}`;
      const photo_url = photoPreview || selectedEmployee.photo_url;
      
      const serviceValue = formData.assignment === 'administration' ? 'Administration' : 
                         formData.assignment === 'technique' ? 'Service Technique' : 'Gare';

      const updatedEmployee = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: full_name,
        role: formData.role,
        gare_id: formData.gare_id || null,
        service: serviceValue,
        phone: formData.phone || null,
        email: formData.email || null,
        sexe: formData.sexe || null,
        adresse: formData.adresse || null,
        cni_number: formData.cni_number || null,
        permis_number: formData.permis_number || null,
        photo_url
      };

      const { data, error } = await supabase
        .from('employees')
        .update(updatedEmployee)
        .eq('id', selectedEmployee.id)
        .select();
      
      if (error) throw error;
      
      toast.success("Employé mis à jour avec succès");
      setEmployees(employees.map(e => e.id === selectedEmployee.id ? data[0] : e));
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      setFormData({ 
        first_name: '', last_name: '', role: '', assignment: '', 
        gare_id: '', phone: '', email: '',
        sexe: '', adresse: '', cni_number: '', permis_number: ''
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormData({
      first_name: emp.first_name || '',
      last_name: emp.last_name || '',
      role: emp.role || '',
      assignment: emp.service === 'Administration' ? 'administration' : 
                 emp.service === 'Service Technique' ? 'technique' : 'gare',
      gare_id: emp.gare_id || '',
      phone: emp.phone || '',
      email: emp.email || '',
      sexe: emp.sexe || '',
      adresse: emp.adresse || '',
      cni_number: emp.cni_number || '',
      permis_number: emp.permis_number || ''
    });
    setPhotoPreview(emp.photo_url);
    setIsCardOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.from('employees').delete().eq('id', employeeToDelete);
      if (error) throw error;
      
      toast.success("Employé supprimé avec succès");
      setEmployees(employees.filter(e => e.id !== employeeToDelete));
      setIsDeleteDialogOpen(false);
      setIsCardOpen(false);
      setEmployeeToDelete(null);
    } catch (error: any) {
      toast.error("Erreur lors de la suppression: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setEmployeeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.matricule.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'technique') {
      return matchesSearch && emp.service?.toLowerCase().includes('tech');
    }
    if (activeTab === 'administration') {
      return matchesSearch && emp.service?.toLowerCase().includes('admin');
    }
    if (activeTab === 'gares' && selectedGare) {
      return matchesSearch && emp.gare_id === selectedGare;
    }
    
    return matchesSearch;
  });

  const exportToExcel = () => {
    try {
      const dataToExport = filteredEmployees.map(emp => ({
        Matricule: emp.matricule,
        Nom: emp.last_name,
        Prénom: emp.first_name,
        'Nom Complet': emp.full_name,
        Rôle: emp.role,
        Service: emp.service,
        Gare: emp.service === 'Gare' ? emp.gare_id : 'Non assigné',
        Téléphone: emp.phone || '',
        Email: emp.email || '',
        Sexe: emp.sexe || '',
        Adresse: emp.adresse || '',
        CNI: emp.cni_number || '',
        Permis: emp.permis_number || '',
        'Date d\'embauche': emp.date_embauche
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Personnel");
      
      // Auto-size columns
      const maxWidths = Object.keys(dataToExport[0] || {}).map(key => {
        const headerLen = key.length;
        const maxValLen = dataToExport.reduce((max, row: any) => {
          const val = row[key] ? String(row[key]).length : 0;
          return Math.max(max, val);
        }, 0);
        return { wch: Math.max(headerLen, maxValLen) + 2 };
      });
      worksheet['!cols'] = maxWidths;

      XLSX.writeFile(workbook, `DBS_Personnel_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Liste exportée en Excel");
    } catch (error: any) {
      toast.error("Erreur d'export Excel: " + error.message);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.text("DBS BAN - LISTE DU PERSONNEL", 14, 22);
      
      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Date d'export: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total employés: ${filteredEmployees.length}`, 14, 35);
      
      const head = [['Matricule', 'Nom Complet', 'Rôle', 'Service', 'Assignation']];
      const body = filteredEmployees.map(emp => [
        emp.matricule,
        emp.full_name,
        emp.role,
        emp.service,
        emp.gare_id || 'Admin'
      ]);

      autoTable(doc, {
        head,
        body,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { top: 40 },
        didDrawPage: (data) => {
          // Footer
          const str = `Page ${data.pageNumber}`;
          doc.setFontSize(10);
          doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });

      doc.save(`DBS_Personnel_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Liste exportée en PDF");
    } catch (error: any) {
      toast.error("Erreur d'export PDF: " + error.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Clock className="animate-spin h-8 w-8 text-primary" /></div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'personnel':
        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Chercher par nom ou matricule..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Button 
                  variant="outline" 
                  onClick={exportToExcel}
                  className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                >
                  <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportToPDF}
                  className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                >
                  <FileText className="h-5 w-5 text-rose-500" />
                  PDF
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-2xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 shrink-0">
                  <UserPlus className="h-5 w-5" />
                  Nouveau
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => (
                <motion.div
                  key={emp.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => { setSelectedEmployee(emp); setIsCardOpen(true); }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-50 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 rounded-2xl shadow-sm border-2 border-slate-50">
                      <AvatarImage src={emp.photo_url} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                        {emp.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{emp.full_name}</h3>
                      <div className="flex flex-col gap-1 mt-1">
                        <Badge variant="outline" className="w-fit text-[10px] border-none bg-slate-100 text-slate-500 font-black tracking-widest uppercase py-0 px-2 h-5">
                          {emp.role}
                        </Badge>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{emp.service}</p>
                          {emp.gare_id && emp.service === 'Gare' && (
                            <p className="text-[10px] text-primary font-black uppercase tracking-wider">
                              <span className="text-slate-300 mr-2">/</span>
                              {emp.gare_id}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredEmployees.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">Aucun employé trouvé</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'absences':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ReportCard title="Bilan Quotidien" type="daily" trend="+2%" />
              <ReportCard title="Bilan Hebdomadaire" type="weekly" trend="-5%" />
              <ReportCard title="Bilan Mensuel" type="monthly" trend="+1%" />
            </div>
            {/* Absence List remains same as previous */}
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black">LOG DES ABSENCES</CardTitle>
                  <CardDescription>Suivi en temps réel</CardDescription>
                </div>
                <Button variant="outline" className="rounded-xl">Historique complet</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {employees.slice(0, 5).map((emp, i) => (
                    <div key={emp.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={emp.photo_url} />
                          <AvatarFallback>E</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900">{emp.full_name}</p>
                          <p className="text-[10px] text-rose-500 font-black uppercase">Absent - {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-lg text-[10px] font-black uppercase tracking-widest border-rose-200 text-rose-500 bg-rose-50">
                        Signalé
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'gares':
        if (selectedGare) {
          const currentGare = allGaresList.find(g => g.id === selectedGare);
          const currentGareName = currentGare?.name || selectedGare;
          const currentGareColor = currentGare?.color || '#3b82f6';
          
          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => setSelectedGare(null)} className="rounded-full h-12 w-12 p-0 bg-white shadow-sm hover:bg-slate-50">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase">
                      Gare: <span style={{ color: currentGareColor }}>{currentGareName}</span>
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">Liste du personnel affecté à cette gare</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <Button 
                    variant="outline" 
                    onClick={exportToExcel}
                    className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                  >
                    <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                    Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={exportToPDF}
                    className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                  >
                    <FileText className="h-5 w-5 text-rose-500" />
                    PDF
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((emp) => (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => { setSelectedEmployee(emp); setIsCardOpen(true); }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-50 cursor-pointer group flex items-center gap-4"
                  >
                    <Avatar className="h-16 w-16 rounded-2xl shadow-sm border-2 border-slate-50 shrink-0">
                      <AvatarImage src={emp.photo_url} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                        {emp.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{emp.full_name}</h3>
                      <div className="flex flex-col gap-1 mt-1">
                        <Badge variant="outline" className="w-fit text-[10px] border-none bg-slate-100 text-slate-500 font-black tracking-widest uppercase py-0 px-2 h-5">
                          {emp.role}
                        </Badge>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{emp.service}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {filteredEmployees.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <Users className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-bold">Aucun personnel dans cette gare</p>
                  </div>
                )}
              </div>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allGaresList.map((gare) => {
              const IconComponent = gare.icon === 'Warehouse' ? Warehouse : 
                                   gare.icon === 'Building' ? Building : 
                                   gare.icon === 'Building2' ? Building2 : MapPin;
                                   
              return (
                <motion.button
                  key={gare.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedGare(gare.id)}
                  className="aspect-square flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-primary/10"
                >
                  <div 
                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-colors"
                    style={{ 
                      backgroundColor: `${gare.color}10`,
                      color: gare.color
                    }}
                  >
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <span className="font-bold text-slate-900 text-center text-sm">{gare.name}</span>
                  <Badge 
                    className="mt-3 border-none font-black text-[10px]"
                    style={{ 
                      backgroundColor: `${gare.color}20`,
                      color: gare.color
                    }}
                  >
                    {employees.filter(e => e.gare_id === gare.id).length} Pers.
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        );

      case 'technique':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3">
                <Wrench className="h-7 w-7 text-primary" /> Personnel Technique
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Button 
                  variant="outline" 
                  onClick={exportToExcel}
                  className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                >
                  <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportToPDF}
                  className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                >
                  <FileText className="h-5 w-5 text-rose-500" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => (
                <motion.div
                  key={emp.id}
                  onClick={() => { setSelectedEmployee(emp); setIsCardOpen(true); }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-50 cursor-pointer flex items-center gap-4"
                >
                  <Avatar className="h-14 w-14 rounded-2xl">
                    <AvatarImage src={emp.photo_url} />
                    <AvatarFallback>{emp.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900">{emp.full_name}</h3>
                    <p className="text-[10px] font-black text-primary uppercase">{emp.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'administration':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3">
                <Building2 className="h-7 w-7 text-primary" /> Administration
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Button 
                  variant="outline" 
                  onClick={exportToExcel}
                  className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                >
                  <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportToPDF}
                  className="rounded-2xl h-12 px-4 gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold shrink-0"
                >
                  <FileText className="h-5 w-5 text-rose-500" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => (
                <motion.div
                  key={emp.id}
                  onClick={() => { setSelectedEmployee(emp); setIsCardOpen(true); }}
                  className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-50 cursor-pointer flex items-center gap-4"
                >
                  <Avatar className="h-14 w-14 rounded-2xl">
                    <AvatarImage src={emp.photo_url} />
                    <AvatarFallback>{emp.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900">{emp.full_name}</h3>
                    <p className="text-[10px] font-black text-primary uppercase">{emp.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            {activeTab === 'absences' ? <Clock className="h-8 w-8 text-primary" /> : <Users className="h-8 w-8 text-primary" />}
            {activeTab.toUpperCase().replace('PERSONNEL', 'GESTION DU PERSONNEL').replace('GARES', 'LES GARES')}
          </h1>
          <p className="text-muted-foreground font-medium mt-1 uppercase text-xs tracking-widest bg-slate-100 w-fit px-2 py-0.5 rounded">
            Espace RH Administrateur
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (selectedGare || '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <ProfessionalCard 
        employee={selectedEmployee} 
        open={isCardOpen} 
        onOpenChange={setIsCardOpen}
        onDelete={confirmDelete}
        onEdit={startEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-xl font-black text-center uppercase tracking-tight">Supprimer l'employé ?</DialogTitle>
            <DialogDescription className="text-center font-medium pt-2">
              Cette action est irréversible. Toutes les données liées à cet employé seront supprimées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl h-12 flex-1 border-slate-200"
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEmployee}
              disabled={saving}
              className="rounded-xl h-12 flex-1 bg-rose-500 hover:bg-rose-600"
            >
              {saving ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setFormData({ 
            first_name: '', last_name: '', role: '', assignment: '', 
            gare_id: '', phone: '', email: '',
            sexe: '', adresse: '', cni_number: '', permis_number: ''
          });
          setFormErrors({});
          setPhotoPreview(null);
          setPhotoFile(null);
        }
      }}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 border-none shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="p-8 pb-4 shrink-0 bg-white z-10 border-b border-slate-50 rounded-t-[2.5rem]">
            <DialogTitle className="text-2xl font-black uppercase flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                {isEditDialogOpen ? <Briefcase className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
              </div>
              {isEditDialogOpen ? "Modifier l'Employé" : "Nouvel Employé"}
            </DialogTitle>
            <DialogDescription className="font-medium">
              {isEditDialogOpen ? "Mettre à jour les informations du personnel" : "Ajouter un nouveau membre au personnel DBS BAN"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
            {/* Photo Upload Section */}
            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-3xl shrink-0">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-20 w-20 shrink-0 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Photo de profil</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Format JPG/PNG, 2Mo max</p>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2 h-7 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  Parcourir
                </Button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="space-y-8">
              {/* Etat Civil */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] px-1">Etat Civil</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Nom</label>
                    <Input 
                      value={formData.last_name}
                      onChange={(e) => {
                        setFormData({...formData, last_name: e.target.value});
                        if (formErrors.last_name) setFormErrors({...formErrors, last_name: ''});
                      }}
                      placeholder="Ex: KOFFI"
                      className={cn("rounded-xl border-slate-100 h-11", formErrors.last_name && "border-rose-500 focus-visible:ring-rose-500")}
                    />
                    {formErrors.last_name && <p className="text-[10px] text-rose-500 font-bold px-1">{formErrors.last_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Prénoms</label>
                    <Input 
                      value={formData.first_name}
                      onChange={(e) => {
                        setFormData({...formData, first_name: e.target.value});
                        if (formErrors.first_name) setFormErrors({...formErrors, first_name: ''});
                      }}
                      placeholder="Ex: Jean"
                      className={cn("rounded-xl border-slate-100 h-11", formErrors.first_name && "border-rose-500 focus-visible:ring-rose-500")}
                    />
                    {formErrors.first_name && <p className="text-[10px] text-rose-500 font-bold px-1">{formErrors.first_name}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Sexe</label>
                    <Select value={formData.sexe} onValueChange={(v) => setFormData({...formData, sexe: v})}>
                      <SelectTrigger className="rounded-xl border-slate-100 h-11">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Téléphone</label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({...formData, phone: e.target.value});
                        if (formErrors.phone) setFormErrors({...formErrors, phone: ''});
                      }}
                      placeholder="07 00 00 00 00"
                      className={cn("rounded-xl border-slate-100 h-11", formErrors.phone && "border-rose-500 focus-visible:ring-rose-500")}
                    />
                    {formErrors.phone && <p className="text-[10px] text-rose-500 font-bold px-1">{formErrors.phone}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Email (Optionnel)</label>
                  <Input 
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (formErrors.email) setFormErrors({...formErrors, email: ''});
                    }}
                    placeholder="email@dbs-ban.ci"
                    className={cn("rounded-xl border-slate-100 h-11", formErrors.email && "border-rose-500 focus-visible:ring-rose-500")}
                  />
                  {formErrors.email && <p className="text-[10px] text-rose-500 font-bold px-1">{formErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Adresse</label>
                  <Input 
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    placeholder="Quartier, Ville"
                    className="rounded-xl border-slate-100 h-11"
                  />
                </div>
              </div>

              {/* Professionnel */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] px-1">Assignation Technique</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Assignation</label>
                    <Select value={formData.assignment} onValueChange={(v) => {
                      setFormData({...formData, assignment: v});
                      if (formErrors.assignment) setFormErrors({...formErrors, assignment: ''});
                    }}>
                      <SelectTrigger className={cn("rounded-xl border-slate-100 h-11", formErrors.assignment && "border-rose-500 ring-rose-500")}>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="gare">Une Gare</SelectItem>
                        <SelectItem value="technique">Service Technique</SelectItem>
                        <SelectItem value="administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.assignment && <p className="text-[10px] text-rose-500 font-bold px-1 mt-1">{formErrors.assignment}</p>}
                  </div>

                  {formData.assignment === 'gare' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Agence (Gare)</label>
                      <Select value={formData.gare_id} onValueChange={(v) => {
                        setFormData({...formData, gare_id: v});
                        if (formErrors.gare_id) setFormErrors({...formErrors, gare_id: ''});
                      }}>
                        <SelectTrigger className={cn("rounded-xl border-slate-100 h-11", formErrors.gare_id && "border-rose-500 ring-rose-500")}>
                          <SelectValue placeholder="Gare" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {allGaresList.map(g => (
                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.gare_id && <p className="text-[10px] text-rose-500 font-bold px-1 mt-1">{formErrors.gare_id}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Fonction</label>
                  <Select value={formData.role} onValueChange={(v) => {
                    setFormData({...formData, role: v});
                    if (formErrors.role) setFormErrors({...formErrors, role: ''});
                  }}>
                    <SelectTrigger className={cn("rounded-xl border-slate-100 h-11", formErrors.role && "border-rose-500 ring-rose-500")}>
                      <SelectValue placeholder="Saisir la fonction" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl h-64">
                      {allRoles.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.role && <p className="text-[10px] text-rose-500 font-bold px-1 mt-1">{formErrors.role}</p>}
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4 pt-2 pb-4">
                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] px-1">Documents & ID</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">N° CNI</label>
                    <Input 
                      value={formData.cni_number}
                      onChange={(e) => setFormData({...formData, cni_number: e.target.value})}
                      placeholder="C00..."
                      className="rounded-xl border-slate-100 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">N° Permis</label>
                    <Input 
                      value={formData.permis_number}
                      onChange={(e) => setFormData({...formData, permis_number: e.target.value})}
                      placeholder="P00..."
                      className="rounded-xl border-slate-100 h-11"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-4 shrink-0 bg-white border-t border-slate-50 flex items-center justify-end gap-3 rounded-b-[2.5rem]">
            <Button variant="ghost" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
            }} className="rounded-xl h-11 px-6 font-bold">Annuler</Button>
            <Button onClick={isEditDialogOpen ? handleUpdateEmployee : handleAddEmployee} disabled={saving} className="rounded-xl h-11 px-8 font-bold gap-2">
              {saving ? "Chargement..." : <>{isEditDialogOpen ? <BadgeCheck className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {isEditDialogOpen ? "Mettre à jour" : "Enregistrer"}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportCard({ title, type, trend }: { title: string, type: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  
  return (
    <Card className="border-none shadow-sm rounded-[2rem] p-8 bg-white flex flex-col justify-between h-52 group hover:shadow-xl transition-all border border-transparent hover:border-primary/10">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{title}</p>
          <div className="h-1 w-8 bg-primary rounded-full" />
        </div>
        <Badge className={cn(
          "border-none h-7 rounded-full px-3 text-[11px] font-black tracking-tight",
          isPositive ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
        )}>
          {trend} {isPositive ? '↑' : '↓'}
        </Badge>
      </div>
      <div>
        <p className="text-5xl font-black text-slate-900 tracking-tighter group-hover:scale-110 transition-transform origin-left inline-block">
          {type === 'daily' ? '12' : type === 'weekly' ? '45' : '156'}
        </p>
        <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">Incidents signalés</p>
      </div>
    </Card>
  );
}
