import {InputGroup, Input, InputLeftElement} from '@chakra-ui/react';
import * as React from 'react';
import {useCallback} from 'react';
import {MdSearch} from 'react-icons/md';

export function SearchUserInput({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [setSearch],
  );
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <MdSearch />
      </InputLeftElement>
      <Input placeholder="John Doe" value={search} onChange={onChange} />
    </InputGroup>
  );
}
