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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string;
}

const CreateProjectModal = ({ open, onOpenChange, channelId }: CreateProjectModalProps) => {
  const { addVideoProject } = useAppStore();
  const [jsonContent, setJsonContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleJson = `{
  "title": "Mi Proyecto de Video",
  "description": "Video de ejemplo generado con prompts, imágenes y locución",
  "scenes": [
    {
      "id": 1,
      "status": "idle",
      "scene_description": "Una vista panorámica de una ciudad futurista al amanecer.",
      "image_prompts": {
        "start_prompt": "A futuristic city skyline at dawn, neon lights fading, warm sunrise glow.",
        "end_prompt": "The city fully illuminated, flying cars passing, holographic billboards shining."
      },
      "dialogues": [
        {
          "speaker1": {
            "voice_type": "voz_masculina_profunda",
            "text_speaker": "Bienvenidos a nuestro canal de tecnología futurista."
          }
        }
      ],
      "video_sources": [
        {
          "id": "clip1",
          "url": "https://drive.google.com/file/d/1ABCDEF123456789/view?usp=sharing",
          "cuts": [
            { "part": "part1", "time_range": "00:10-00:30" }
          ]
        }
      ],
      "attachments": [
        {
          "type": "image",
          "url": "https://drive.google.com/file/d/1XYZ987654321/view?usp=sharing",
          "description": "Imagen de referencia del skyline"
        }
      ]
    }
  ]
}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!jsonContent.trim()) {
        toast({
          title: "Error",
          description: "Por favor ingresa el contenido JSON del proyecto",
          variant: "destructive",
        });
        return;
      }

      // Parse and validate JSON
      let projectData;
      try {
        projectData = JSON.parse(jsonContent);
      } catch (error) {
        toast({
          title: "JSON inválido",
          description: "El formato JSON no es válido. Por favor revisa la sintaxis.",
          variant: "destructive",
        });
        return;
      }

      // Validate required fields
      if (!projectData.title) {
        toast({
          title: "Error",
          description: "El JSON debe incluir un campo 'title'",
          variant: "destructive",
        });
        return;
      }

      // Ensure scenes have proper structure
      if (projectData.scenes) {
        projectData.scenes = projectData.scenes.map((scene: any, index: number) => ({
          ...scene,
          id: scene.id || Date.now() + index,
          status: scene.status || 'idle'
        }));
      }

      addVideoProject(channelId, projectData);
      
      toast({
        title: "Proyecto creado",
        description: `El proyecto "${projectData.title}" ha sido creado exitosamente`,
      });

      // Reset and close
      setJsonContent('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el proyecto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setJsonContent(sampleJson);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Crear Proyecto de Video
          </DialogTitle>
          <DialogDescription>
            Pega aquí el JSON con la estructura de tu proyecto de video
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-4">
          {/* JSON Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="json-content" className="text-sm font-medium">
                Contenido JSON del Proyecto
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="text-xs"
              >
                Cargar ejemplo
              </Button>
            </div>
            <Textarea
              id="json-content"
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              placeholder="Pega aquí tu JSON..."
              className="min-h-96 font-mono text-sm resize-none"
              required
            />
          </div>

          {/* Info panel */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Estructura JSON requerida:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <code>title</code>: Título del proyecto (requerido)</li>
              <li>• <code>description</code>: Descripción del proyecto</li>
              <li>• <code>scenes</code>: Array de escenas con prompts, diálogos y recursos</li>
              <li>• Cada escena debe incluir: <code>scene_description</code>, <code>image_prompts</code>, <code>dialogues</code></li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
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
              {isLoading ? "Creando..." : "Crear Proyecto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;