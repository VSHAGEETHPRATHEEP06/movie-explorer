import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Slider, 
  Button, 
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 70 }, (_, i) => currentYear - i);

const MovieFilter = ({ onFilterChange, onClearFilters, activeFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const genres = useSelector((state) => state.movies.genres);
  
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: [0, 10]
  });
  
  const [expanded, setExpanded] = useState(!isMobile);
  
  // Update local state when activeFilters change
  useEffect(() => {
    if (activeFilters) {
      setFilters({
        genre: activeFilters.genre || '',
        year: activeFilters.year || '',
        rating: activeFilters.rating || [0, 10]
      });
    }
  }, [activeFilters]);
  
  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleApplyFilters = () => {
    // Only include non-empty filters
    const activeFilters = {};
    
    if (filters.genre) activeFilters.genre = filters.genre;
    if (filters.year) activeFilters.year = filters.year;
    if (filters.rating[0] > 0 || filters.rating[1] < 10) {
      activeFilters.rating = filters.rating;
    }
    
    onFilterChange(activeFilters);
    
    // Auto-collapse on mobile after applying
    if (isMobile) {
      setExpanded(false);
    }
  };
  
  const handleClearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: [0, 10]
    });
    onClearFilters();
  };
  
  const hasActiveFilters = () => {
    return filters.genre || filters.year || filters.rating[0] > 0 || filters.rating[1] < 10;
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.genre) count++;
    if (filters.year) count++;
    if (filters.rating[0] > 0 || filters.rating[1] < 10) count++;
    return count;
  };
  
  const filterContent = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Filters
        </Typography>
        {hasActiveFilters() && (
          <Button 
            size="small" 
            startIcon={<ClearIcon />} 
            onClick={handleClearFilters}
            color="inherit"
          >
            Clear All
          </Button>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'flex-start' }}>
        {/* Genre Filter */}
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel id="genre-filter-label">Genre</InputLabel>
          <Select
            labelId="genre-filter-label"
            id="genre-filter"
            value={filters.genre}
            label="Genre"
            onChange={(e) => handleChange('genre', e.target.value)}
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Year Filter */}
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel id="year-filter-label">Year</InputLabel>
          <Select
            labelId="year-filter-label"
            id="year-filter"
            value={filters.year}
            label="Year"
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Rating Filter */}
        <FormControl fullWidth sx={{ minWidth: 120, mt: { xs: 2, md: 0 } }}>
          <Typography id="rating-slider-label" gutterBottom>
            Rating: {filters.rating[0]} - {filters.rating[1]}
          </Typography>
          <Box sx={{ px: { xs: 1, md: 2 }, pt: 1, pb: 2, width: '100%' }}>
            <Slider
              value={filters.rating}
              onChange={(_, value) => handleChange('rating', value)}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.5}
              marks={[
                { value: 0, label: '0' },
                { value: 5, label: '5' },
                { value: 10, label: '10' }
              ]}
              aria-labelledby="rating-slider-label"
            />
          </Box>
        </FormControl>
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button 
          variant="contained" 
          onClick={handleApplyFilters}
          disabled={!hasActiveFilters()}
          startIcon={<FilterIcon />}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
  
  // Show filter summary chips
  const filterSummary = () => {
    const activeFilterCount = getActiveFilterCount();
    
    if (activeFilterCount === 0) return null;
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {filters.genre && (
          <Chip 
            label={`Genre: ${genres.find(g => g.id === filters.genre)?.name || filters.genre}`}
            onDelete={() => {
              handleChange('genre', '');
              handleApplyFilters();
            }}
            color="primary"
            variant="outlined"
          />
        )}
        
        {filters.year && (
          <Chip 
            label={`Year: ${filters.year}`}
            onDelete={() => {
              handleChange('year', '');
              handleApplyFilters();
            }}
            color="primary"
            variant="outlined"
          />
        )}
        
        {(filters.rating[0] > 0 || filters.rating[1] < 10) && (
          <Chip 
            label={`Rating: ${filters.rating[0]} - ${filters.rating[1]}`}
            onDelete={() => {
              handleChange('rating', [0, 10]);
              handleApplyFilters();
            }}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
    );
  };
  
  return (
    <>
      {isMobile ? (
        <Accordion 
          expanded={expanded} 
          onChange={() => setExpanded(!expanded)}
          sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}
          elevation={1}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-panel-content"
            id="filter-panel-header"
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterIcon sx={{ mr: 1 }} />
              <Typography>Filters</Typography>
              {!expanded && getActiveFilterCount() > 0 && (
                <Chip 
                  size="small" 
                  label={getActiveFilterCount()} 
                  color="primary" 
                  sx={{ ml: 1 }} 
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {filterContent}
          </AccordionDetails>
        </Accordion>
      ) : (
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          {filterContent}
        </Paper>
      )}
      
      {filterSummary()}
    </>
  );
};

export default MovieFilter;
