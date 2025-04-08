
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { SearchFilters } from '@/types';
import { CalendarIcon, Search, X, Key, Hash, FileText, Fingerprint, HelpCircle, Database } from 'lucide-react';
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
    state: '',
    transactionId: '',
    sessionId: '',
    searchedQuery: '',
    podId: '',
    sfmStatus: 'all'
  });

  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [showStateFilter, setShowStateFilter] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

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

  const handleSearchedQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchedQuery: e.target.value }));
  };

  const handlePodIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, podId: e.target.value }));
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

  const handleSfmStatusChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      sfmStatus: value as 'all' | 'yes' | 'no' 
    }));
  };

  const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, transactionId: e.target.value }));
  };

  const handleSessionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, sessionId: e.target.value }));
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
      state: '',
      transactionId: '',
      sessionId: '',
      searchedQuery: '',
      podId: '',
      sfmStatus: 'all'
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
      state: '',
      transactionId: '',
      sessionId: '',
      searchedQuery: '',
      podId: '',
      sfmStatus: 'all'
    });
  };

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Search Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

        <div className="space-y-2">
          <Label htmlFor="searchedQuery">Searched Query</Label>
          <div className="relative">
            <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchedQuery"
              placeholder="Search by query used..."
              value={filters.searchedQuery}
              onChange={handleSearchedQueryChange}
              className="pl-8"
            />
          </div>
        </div>

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

        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="sfmStatus">SFM Status</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto ml-1">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter documents that have been added to Secure File Management system</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={filters.sfmStatus} onValueChange={handleSfmStatusChange}>
            <SelectTrigger id="sfmStatus" className="flex items-center">
              <Database className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="All Documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="yes">Added to SFM</SelectItem>
              <SelectItem value="no">Not in SFM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={`space-y-2 col-span-1 md:col-span-2 ${showStateFilter ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
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

      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={toggleAdvancedSearch}
          size="sm"
        >
          {showAdvancedSearch ? "Hide Advanced" : "Show Advanced"}
        </Button>
      </div>

      {showAdvancedSearch && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <div className="relative">
              <Key className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="transactionId"
                placeholder="Search by transaction ID..."
                value={filters.transactionId}
                onChange={handleTransactionIdChange}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionId">Session ID</Label>
            <div className="relative">
              <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="sessionId"
                placeholder="Search by session ID..."
                value={filters.sessionId}
                onChange={handleSessionIdChange}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="podId">Pod ID</Label>
            <div className="relative">
              <Fingerprint className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="podId"
                placeholder="Search by Pod ID..."
                value={filters.podId}
                onChange={handlePodIdChange}
                className="pl-8"
              />
            </div>
          </div>
        </div>
      )}

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
