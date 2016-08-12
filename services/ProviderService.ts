import {Inject} from "di-ts";
import {db} from "../db";
import {Branding} from "../models/Branding";
import {Provider} from "../models/Provider";

@Inject
export class ProviderService {

  constructor() {

  }

  getBranding(id: string): Promise<Branding> {

    return db.model(Branding)
      .findOne({
        include: [
          {
            model: db.model(Provider),
            as: 'providers',
            where: {id}
          }
        ]
      })
      .then((branding: Branding) => {
        if(branding) {
          delete branding.dataValues.providers;
        }
        return branding;
      })
    ;
  }

}
