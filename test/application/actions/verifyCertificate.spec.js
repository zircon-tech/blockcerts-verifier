import { configureStore } from '../../../src/store';
import verifyCertificate from '../../../src/actions/verifyCertificate';
import updateCertificateDefinition from '../../../src/actions/updateCertificateDefinition';
import { getVerifiedSteps } from '../../../src/selectors/certificate';
import getInitialState from '../../../src/store/getInitialState';
import validCertificateFixture from '../../fixtures/valid-certificate-example';
import invalidCertificateFixture from '../../fixtures/invalid-certificate-example';
import initialValidCertificateStepsAssertions from '../../assertions/initialValidCertificateSteps';
import validCertificateStepsAssertions from '../../assertions/validCertificateSteps';
import invalidCertificateStepsAssertions from '../../assertions/invalidCertificateSteps';
import { getVerificationStatus } from '../../../src/selectors/verification';
import VERIFICATION_STATUS from '../../../src/constants/verificationStatus';

describe('verifyCertificate action creator test suite', function () {
  describe('given the verification of certificates is not disabled', function () {
    let store;

    beforeEach(function () {
      const apiConfiguration = {
        disableAutoVerify: true
      };
      const initialState = getInitialState(apiConfiguration);
      store = configureStore(initialState);
    });

    afterEach(function () {
      store = null;
    });

    describe('given the action is triggered', function () {
      it('should set the verificationStatus in the state to started', function () {
        // add a certificate definition to be verified
        store.dispatch(updateCertificateDefinition(validCertificateFixture));
        store.dispatch(verifyCertificate());

        const state = store.getState();

        expect(getVerificationStatus(state)).toBe(VERIFICATION_STATUS.STARTED);
      });
    });

    describe('given the verification is ended', function () {
      describe('and the verification was of a valid certificate', function () {
        it('should set the verificationStatus in the state to success', async function () {
          // add a certificate definition to be verified
          store.dispatch(updateCertificateDefinition(validCertificateFixture));
          await store.dispatch(verifyCertificate());

          const state = store.getState();

          expect(getVerificationStatus(state)).toBe(VERIFICATION_STATUS.SUCCESS);
        });
      });
    });

    describe('given there is a valid certificate in the state', function () {
      it('should store the different steps in the state', async function () {
        // add a certificate definition to be verified
        await store.dispatch(updateCertificateDefinition(validCertificateFixture));
        await store.dispatch(verifyCertificate());

        const state = store.getState();

        expect(getVerifiedSteps(state)).toEqual(validCertificateStepsAssertions);
      });
    });

    describe('given there is an invalid certificate in the state', function () {
      it('should store the different steps in the state', async function () {
        // add a certificate definition to be verified
        await store.dispatch(updateCertificateDefinition(invalidCertificateFixture));
        await store.dispatch(verifyCertificate());

        const state = store.getState();

        expect(getVerifiedSteps(state)).toEqual(invalidCertificateStepsAssertions);
      });
    });

    describe('verifying a second certificate', function () {
      describe('given the certificates definitions valid definitions', function () {
        it('should only maintain the verifiedSteps of the latest certificate verified', async function () {
          // trigger initial verification
          await store.dispatch(updateCertificateDefinition(validCertificateFixture));
          await store.dispatch(verifyCertificate());

          await store.dispatch(updateCertificateDefinition(invalidCertificateFixture));
          await store.dispatch(verifyCertificate());
          const state = store.getState();

          expect(getVerifiedSteps(state)).toEqual(invalidCertificateStepsAssertions);
        });
      });
    });
  });

  describe('given the verification of certificates is disabled', function () {
    it('should not verify certificates', async function () {
      const apiConfiguration = {
        disableVerify: true
      };
      const initialState = getInitialState(apiConfiguration);
      const store = configureStore(initialState);

      await store.dispatch(updateCertificateDefinition(validCertificateFixture));
      await store.dispatch(verifyCertificate());

      const state = store.getState();

      expect(getVerifiedSteps(state)).toEqual(initialValidCertificateStepsAssertions);
    });
  });
});
