/**
 * @title Buy Virtual Phone Number
 * @description Creates a new virtual phone number through Salvy API
 */

/**
 * Interface for the request body parameters sent to the Salvy API
 */
export interface Props {
  /**
   * @title Identifier
   * @description An optional identifier for the virtual phone number
   */
  identifier?: string;
  
  /**
   * @title Area Code
   * @description Area code for the desired phone number (between 11 and 99)
   */
  areaCode: number;
  
  /**
   * @title Redirect Phone Number
   * @description Phone number (including area code) to redirect calls to
   */
  redirectPhoneNumber: string;
  
  /**
   * @title Redirect Expiration
   * @description Expiration date for call redirection (defaults to 72 hours if not provided)
   * @format date-time
   */
  redirectExpiresAt?: string;
}

/**
 * Interface for the response data from the Salvy API
 */
export interface SalvyPhoneResponseData {
  /** Unique ID assigned by Salvy */
  id: string;
  
  /** The identifier provided in the request (if any) */
  identifier: string | null;
  
  /** The assigned virtual phone number in E.164 format */
  phoneNumber: string;
  
  /** Status of the virtual number */
  status: "active" | "canceled";
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Cancellation timestamp (if applicable) */
  canceledAt: string | null;
  
  /** Reason for cancellation (if applicable) */
  cancelReason: string | null;
  
  /** The redirect phone number in E.164 format */
  redirectPhoneNumber: string;
  
  /** Expiration date for the call redirection */
  redirectExpiresAt: string | null;
}

/**
 * Action to purchase a virtual phone number from Salvy API
 */
export default async function buyPhoneNumber(
  props: Props,
): Promise<SalvyPhoneResponseData> {
  const { areaCode, redirectPhoneNumber, identifier, redirectExpiresAt } = props;
  
  // Validate required parameters
  if (!areaCode || !redirectPhoneNumber) {
    throw new Error("Area code and redirect phone number are required");
  }
  
  // Validate area code range
  if (areaCode < 11 || areaCode > 99) {
    throw new Error("Area code must be between 11 and 99");
  }
  
  // Get Salvy API token from environment variables
  const token = Deno.env.get("SALVY_TOKEN");
  if (!token) {
    throw new Error("SALVY_TOKEN environment variable is not set");
  }
  
  try {
    const response = await fetch("https://api.salvy.com.br/api/virtual-phone-accounts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        areaCode,
        redirectPhoneNumber,
        redirectExpiresAt,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to purchase phone number: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data: SalvyPhoneResponseData = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Error purchasing phone number:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to purchase phone number: ${errorMessage}`);
  }
} 