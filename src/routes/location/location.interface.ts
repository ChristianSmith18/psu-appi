export interface Language {
  code: string;
  name: string;
  native: string;
}

export interface Location {
  geoname_id: number;
  capital: string;
  languages: Language[];
  country_flag: string;
  country_flag_emoji: string;
  country_flag_emoji_unicode: string;
  calling_code: string;
  is_eu: boolean;
}

export class RootObjectLocation {
  ip: string;
  type: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip?: any;
  latitude: number;
  longitude: number;
  location: Location;
}

export class ParseLocation {
  ip: string;
  continent: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}
