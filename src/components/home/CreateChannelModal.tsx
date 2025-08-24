import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface CreateChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  'Noticias',
  'Entretenimiento',
  'Educación',
  'Tecnología',
  'Deportes',
  'Música',
  'Gaming',
  'Cocina',
  'Viajes',
  'Lifestyle'
];

const languages = [
  { code: 'ES', name: 'Español' },
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
  { code: 'PT', name: 'Português' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'IT', name: 'Italiano' }
];

const CreateChannelModal = ({ open, onOpenChange }: CreateChannelModalProps) => {
  const { addChannel } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    imagen1: '',
    imagen2: '',
    gmail: '',
    descripcion: '',
    categorias: '',
    api_key: '',
    idioma: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.titulo || !formData.gmail) {
        toast({
          title: "Error",
          description: "Título y Gmail son campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      addChannel(formData);
      
      toast({
        title: "Canal creado",
        description: `El canal "${formData.titulo}" ha sido creado exitosamente`,
      });

      // Reset form and close modal
      setFormData({
        titulo: '',
        imagen1: '',
        imagen2: '',
        gmail: '',
        descripcion: '',
        categorias: '',
        api_key: '',
        idioma: ''
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el canal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Crear Nuevo Canal</DialogTitle>
          <DialogDescription>
            Completa los siguientes campos para crear tu canal de video
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-sm font-medium">
              Nombre del Canal *
            </Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              placeholder="Ej: Noticias Globales"
              required
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imagen1" className="text-sm font-medium">
                Imagen Banner (16:9)
              </Label>
              <div className="relative">
                <Input
                  id="imagen1"
                  value={formData.imagen1}
                  onChange={(e) => handleInputChange('imagen1', e.target.value)}
                  placeholder="URL de la imagen 16:9"
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagen2" className="text-sm font-medium">
                Avatar (1:1)
              </Label>
              <div className="relative">
                <Input
                  id="imagen2"
                  value={formData.imagen2}
                  onChange={(e) => handleInputChange('imagen2', e.target.value)}
                  placeholder="URL de la imagen 1:1"
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Gmail */}
          <div className="space-y-2">
            <Label htmlFor="gmail" className="text-sm font-medium">
              Cuenta Gmail *
            </Label>
            <Input
              id="gmail"
              type="email"
              value={formData.gmail}
              onChange={(e) => handleInputChange('gmail', e.target.value)}
              placeholder="canal@gmail.com"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Describe tu canal..."
              rows={3}
            />
          </div>

          {/* Category and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Categoría</Label>
              <Select onValueChange={(value) => handleInputChange('categorias', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Idioma</Label>
              <Select onValueChange={(value) => handleInputChange('idioma', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api_key" className="text-sm font-medium">
              API Key de Google Drive
            </Label>
            <Input
              id="api_key"
              value={formData.api_key}
              onChange={(e) => handleInputChange('api_key', e.target.value)}
              placeholder="Tu API Key de Google Drive"
              type="password"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              {isLoading ? "Creando..." : "Crear Canal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;