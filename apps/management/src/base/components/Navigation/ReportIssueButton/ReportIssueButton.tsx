import {Button} from '@chakra-ui/react';
import * as React from 'react';
import {MdErrorOutline} from 'react-icons/md';

export function ReportIssueButton() {
  return (
    <Button leftIcon={<MdErrorOutline />} variant="link">
      Report issue
    </Button>
  );
}
