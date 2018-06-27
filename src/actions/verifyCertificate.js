import domain from '../domain';
import * as ACTIONS from '../constants/actionTypes';
import validateUrlInput from './validateUrlInput';
import stepVerified from './stepVerified';
import { getCertificateUrl } from '../selectors/input';
import updateCertificateDefinition from './updateCertificateDefinition';

export default function verifyCertificate () {
  return async function (dispatch, getState) {
    dispatch({
      type: ACTIONS.VERIFY_CERTIFICATE
    });

    const url = getCertificateUrl(getState());

    const validInput = dispatch(validateUrlInput(url)).payload.isValid;
    if (!validInput) {
      return null;
    }

    const certificateDefinition = await domain.certificates.retrieve(url);

    if (certificateDefinition && typeof certificateDefinition !== 'string') {
      dispatch(updateCertificateDefinition(certificateDefinition));
    }

    function stepVerifyCb (stepCode, stepName, status) {
      dispatch(stepVerified({ stepCode, stepName, status }));
    }

    await domain.certificates.verify(certificateDefinition, stepVerifyCb, stepVerifyCb);
  };
}
