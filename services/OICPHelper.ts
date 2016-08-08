import {Inject} from "di-ts";

const EVCO_ID_REGEX = /([A-Za-z]{2}\-?[A-Za-z0-9]{3}\-?C[A-Za-z0-9]{8}\-?[\d|X])|([A-Za-z]{2}[\*|\-]?[A-Za-z0-9]{3}[\*|\-]?[A-Za-z0-9]{6}[\*|\-]?[\d|X])/;
const PROVIDER_ID_REGEX = /[A-Za-z]{2}\-?[A-Za-z0-9]{3}|[A-Za-z]{2}[\*|-]?[A-Za-z0-9]{3}/;

@Inject
export class OICPHelper {

  getProviderId(evcoId: string) {

    let match = PROVIDER_ID_REGEX.exec(evcoId);

    if(match && match[1]) {
      return match[1];
    }

    return null;
  }

  validateEvcoId(evcoId: string) {

    return EVCO_ID_REGEX.test(evcoId);
  }
}
