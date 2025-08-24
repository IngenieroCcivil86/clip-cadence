import { useState, useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import Header from '@/components/layout/Header';
import ChannelCard from '@/components/home/ChannelCard';
import CreateChannelModal from '@/components/home/CreateChannelModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Grid3X3, List, Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 16;

const categories = ['Todas', 'Noticias', 'Entretenimiento', 'Educación', 'Tecnología', 'Deportes', 'Música', 'Gaming', 'Cocina', 'Viajes', 'Lifestyle'];
const languages = [
  { code: 'Todos', name: 'Todos los idiomas' },
  { code: 'ES', name: 'Español' },
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
  { code: 'PT', name: 'Português' }
];

const Index = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const {
    channels,
    viewMode,
    searchQuery,
    selectedCategory,
    selectedLanguage,
    currentPage,
    setViewMode,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLanguage,
    setCurrentPage
  } = useAppStore();

  // Filter channels based on search and filters
  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = !searchQuery || 
        channel.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || selectedCategory === 'Todas' || 
        channel.categorias === selectedCategory;
      
      const matchesLanguage = !selectedLanguage || selectedLanguage === 'Todos' || 
        channel.idioma === selectedLanguage;

      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [channels, searchQuery, selectedCategory, selectedLanguage]);

  // Paginate channels
  const totalPages = Math.ceil(filteredChannels.length / ITEMS_PER_PAGE);
  const paginatedChannels = filteredChannels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar canales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* View mode toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Idioma" />
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

          {/* Active filters */}
          {(searchQuery || (selectedCategory && selectedCategory !== 'Todas') || (selectedLanguage && selectedLanguage !== 'Todos')) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory && selectedCategory !== 'Todas' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('Todas')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedLanguage && selectedLanguage !== 'Todos' && (
                <Badge variant="secondary" className="gap-1">
                  {languages.find(l => l.code === selectedLanguage)?.name}
                  <button
                    onClick={() => setSelectedLanguage('Todos')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredChannels.length} canal{filteredChannels.length !== 1 ? 'es' : ''} encontrado{filteredChannels.length !== 1 ? 's' : ''}
        </div>

        {/* Channels grid/list */}
        {paginatedChannels.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {paginatedChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {channels.length === 0 ? (
                <>
                  <div className="text-lg font-medium mb-2">¡Bienvenido a Clip Cadence!</div>
                  <div>No tienes canales aún. Crea tu primer canal para comenzar.</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-medium mb-2">No se encontraron canales</div>
                  <div>Prueba con diferentes filtros o términos de búsqueda.</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </main>

      {/* Floating add button */}
      <Button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-40"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create channel modal */}
      <CreateChannelModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default Index;
