import {Tr, Td, Skeleton, SkeletonCircle} from '@chakra-ui/react';
import * as React from 'react';

export function SkeletonUserList() {
  return (
    <>
      {Array.from(Array(10), (_, i) => (
        <Tr key={i}>
          <Td>
            <SkeletonCircle size="12" />
          </Td>
          <Td>
            <Skeleton height="6" />
          </Td>
        </Tr>
      ))}
    </>
  );
}
