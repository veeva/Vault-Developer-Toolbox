import { useEffect, useState } from 'react';
import { query, retrieveDomainInformation } from '../../services/ApiService';

export default function useVaultInfo() {
    const [vaultInfoError, setVaultInfoError] = useState({ hasError: false, errorMessage: '' });
    const [loadingVaultInfo, setLoading] = useState(false);

    /**
     * Retrieves Vault info via the Retrieve Domain Information and Validate Session 
     * User endpoints.
     */ 
    const getVaultInfo = async () => {
        setVaultInfoError({ hasError: false, errorMessage: '' });
        setLoading(true);

        const domainInfoResponse = await retrieveDomainInformation();
        if (domainInfoResponse?.responseStatus === 'SUCCESS') {
            const vaultId = parseInt(sessionStorage.getItem('vaultId'), 10);
            const vaults = domainInfoResponse?.domain__v?.vaults__v;
            vaults.forEach((vault) => {
                if (vault.id === vaultId) {
                    sessionStorage.setItem('vaultName', vault.vault_name__v);
                }
            });
            sessionStorage.setItem('domainType', domainInfoResponse?.domain__v?.domain_type__v);
        } else {
            let error = '';
            if (domainInfoResponse?.errors?.length > 0) {
                error = `${domainInfoResponse.errors[0].type} : ${domainInfoResponse.errors[0].message}`
            }
            setVaultInfoError({ hasError: true, errorMessage: error });
        }

        if (!vaultInfoError.hasError) {
            const vqlResponse = await query(`SELECT username__sys FROM user__sys WHERE id = '${sessionStorage.getItem('userId')}'`);
            if (vqlResponse?.responseStatus !== 'FAILURE') {
                sessionStorage.setItem('userName', vqlResponse?.data[0]?.username__sys);
            } else {
                let error = '';
                if (vqlResponse?.errors?.length > 0) {
                    error = `${vqlResponse.errors[0].type} : ${vqlResponse.errors[0].message}`
                }
                setVaultInfoError({ hasError: true, errorMessage: error });
            }
        }

        setLoading(false);
    };

    /**
     * Retrieve Vault Info on page load, if we don't already have it
     */
    useEffect(() => {
        if (!sessionStorage.getItem('vaultName')) {
            getVaultInfo();
        }
    }, []);

    return {
        vaultInfoError,
        loadingVaultInfo
    }
}
