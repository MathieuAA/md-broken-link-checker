export default interface HttpService {
  head(url: URL): Promise<HttpResponse>;
}

export interface HttpResponse {
  status: number;
}
