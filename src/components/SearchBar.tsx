
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { SearchFilters } from '@/types';
import { CalendarIcon, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { countryHasMultipleStates, getStatesForCountry } from '@/api/documents';

interface SearchBarProps {
  countries: string[];
  documentTypes: string[];
  states: string[];
  onSearch: (filters: SearchFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  countries, 
  documentTypes,
  states,
  onSearch 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchText: '',
    country: '',
    documentType: '',
    dateRange: {
      from: undefined,
      to: undefined
    },
    state: ''
  });

  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [showStateFilter, setShowStateFilter] = useState(false);

  useEffect(() => {
    if (filters.country && filters.country !== 'all') {
      const hasStates = countryHasMultipleStates(filters.country);
      setShowStateFilter(hasStates);
      
      if (hasStates) {
        const countryStates = getStatesForCountry(filters.country);
        setAvailableStates(countryStates);
      } else {
        setFilters(prev => ({ ...prev, state: '' }));
        setAvailableStates([]);
      }
    } else {
      setShowStateFilter(false);
      setFilters(prev => ({ ...prev, state: '' }));
      setAvailableStates([]);
    }
  }, [filters.country]);

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchText: e.target.value }));
  };

  const handleCountryChange = (value: string) => {
    setFilters(prev => ({ ...prev, country: value, state: '' }));
  };

  const handleDocumentTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, documentType: value }));
  };

  const handleStateChange = (value: string) => {
    setFilters(prev => ({ ...prev, state: value }));
  };

  const handleDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setFilters(prev => ({ 
      ...prev, 
      dateRange: range
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      searchText: '',
      country: '',
      documentType: '',
      dateRange: {
        from: undefined,
        to: undefined
      },
      state: ''
    });
    setShowStateFilter(false);
    onSearch({
      searchText: '',
      country: '',
      documentType: '',
      dateRange: {
        from: undefined,
        to: undefined
      },
      state: ''
    });
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Search Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Text */}
        <div className="space-y-2">
          <Label htmlFor="searchText">Search in Image URL</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchText"
              placeholder="Search in image URLs..."
              value={filters.searchText}
              onChange={handleSearchTextChange}
              className="pl-8"
            />
          </div>
        </div>

        {/* Country Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={filters.country} onValueChange={handleCountryChange}>
            <SelectTrigger id="country">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document Type Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select value={filters.documentType} onValueChange={handleDocumentTypeChange}>
            <SelectTrigger id="documentType">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State Dropdown - Conditionally rendered */}
        {showStateFilter && (
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={filters.state} onValueChange={handleStateChange}>
              <SelectTrigger id="state">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {availableStates.map(state => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Range */}
        <div className={`space-y-2 col-span-1 md:col-span-2 ${showStateFilter ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from}
                selected={filters.dateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={handleReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
