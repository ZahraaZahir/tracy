export interface EntityResponse {
  id: string;
  isFixed: boolean;
  templateCode: string;
  solutionMap: Record<string, any> | null;
  errorMessages: Record<string, any> | null;
}