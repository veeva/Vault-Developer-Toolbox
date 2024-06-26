import { Flex, Heading, Button, Spacer, Box, Tooltip } from '@chakra-ui/react';
import ConfirmDataDeletion from './ConfirmDataDeletion';
import { isProductionVault } from '../../services/SharedServices';
import useConfirmDataDeletion from '../../hooks/vault-data-tools/useConfirmDataDeletion';

export default function DataToolsHeaderRow({ countData, deleteData, submittingCountJob, submittingDeleteJob, dataType, selectedOptions }) {
    const { isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen, closeConfirmDeleteModal, deleteConfirmationText, setDeleteConfirmationText } = useConfirmDataDeletion();
    const canDelete = !isProductionVault();

    return (
        <>
            <Flex width='100%' margin='10px' alignItems='center'>
                <Heading {...HeadingStyle}>Vault Data Tools</Heading>
                <Spacer />
                <Box>
                    <Button onClick={countData} isLoading={submittingCountJob} {...CountButtonStyle}>
                        Count Data
                    </Button>
                    <Tooltip placement='bottom-end' label={canDelete ? null : 'Read-only in Production'}>
                        <Button
                            onClick={() => setIsConfirmDeleteModalOpen(true)}
                            isDisabled={!canDelete}
                            isLoading={submittingDeleteJob}
                            {...DeleteButtonStyle}
                        >
                            Delete Data
                        </Button>
                    </Tooltip>
                </Box>
            </Flex>
            <ConfirmDataDeletion 
                isOpen={isConfirmDeleteModalOpen} 
                onClose={closeConfirmDeleteModal} 
                onSubmit={deleteData} 
                dataType={dataType} 
                selectedData={selectedOptions}
                deleteConfirmationText={deleteConfirmationText}
                setDeleteConfirmationText={setDeleteConfirmationText}
            />
        </>
    );
}

const HeadingStyle = {
    color: 'veeva_orange.color_mode',
    minWidth: 'max-content',
    marginLeft: '25px',
    marginRight: '5px',
    fontSize: '2rem'
};

const CountButtonStyle = {
    backgroundColor: 'veeva_twilight_blue.500',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_twilight_blue.fifty_percent_opacity'
    },
    marginRight: '5px',
    width: '180px',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)'
};

const DeleteButtonStyle = {
    backgroundColor: 'veeva_sunset_red.color_mode',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_sunset_red.fifty_percent_opacity'
    },
    marginRight: '10px',
    width: '180px',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)'
};
