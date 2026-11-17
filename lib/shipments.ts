export type Mode = "air" | "ocean" | "road";
export type Kind = "origin" | "via" | "checkpoint" | "destination";

export type Waypoint = { name: string; place: string; lat: number; lon: number; kind: Kind; when?: string };

export type Shipment = {
  number: string;
  status: string;
  stage: number; // 0..4, 4 = delivered
  mode: Mode;
  service: string;
  from: string;
  to: string;
  eta: string;
  weight: string;
  packages: number;
  route: Waypoint[];
  at: { after: number; fraction: number }; // vehicle is `fraction` of the way along the route (0..1)
  path?: [number, number][]; // [lat, lon] points that the route follows, from the routing service
};
