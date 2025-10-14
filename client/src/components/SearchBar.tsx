import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableCategories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const SearchBar = ({
  onSearchChange,
  availableTags,
  selectedTags,
  onTagToggle,
  availableCategories,
  selectedCategory,
  onCategoryChange,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearchChange(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-20 font-sans"
          data-testid="input-search"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={clearSearch}
                  data-testid="button-clear-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                data-testid="button-filters"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {availableCategories.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold">Category</div>
                  {availableCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategory === category}
                      onCheckedChange={() => 
                        onCategoryChange(selectedCategory === category ? null : category)
                      }
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              )}
              {availableTags.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold mt-2">Tags</div>
                  {availableTags.map((tag) => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => onTagToggle(tag)}
                    >
                      {tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <AnimatePresence>
        {(selectedTags.length > 0 || selectedCategory) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedCategory && (
              <Badge variant="default" className="flex items-center gap-1">
                Category: {selectedCategory}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => onCategoryChange(null)}
                />
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => onTagToggle(tag)}
                />
              </Badge>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
