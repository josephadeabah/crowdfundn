import React, { useState } from 'react';
import Select, {
  ActionMeta,
  MultiValue,
  SingleValue,
  StylesConfig,
} from 'react-select';

export interface SelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  isMulti?: boolean;
  placeholder?: string;
  onChange: (selectedOptions: SelectedOptionType) => void;
  styles?: StylesConfig<SelectOption>;
}

export type SelectedOptionType = SelectOption | readonly SelectOption[] | null;

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  isMulti = false,
  placeholder = 'Select...',
  onChange,
  styles,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<SelectedOptionType>(null);

  const handleChange = (
    newValue: MultiValue<SelectOption> | SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>,
  ) => {
    setSelectedOption(newValue);
    onChange(newValue as SelectedOptionType);
  };

  const customStyles = {
    ...styles,
    placeholder: (provided: any) => ({
      ...provided,
      textAlign: 'left', // Align placeholder text to the left
    }),
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
      isMulti={isMulti}
      isSearchable
      placeholder={placeholder}
      classNamePrefix="react-select"
      styles={customStyles} // Apply custom styles with left-aligned placeholder
    />
  );
};

export default SearchableSelect;
