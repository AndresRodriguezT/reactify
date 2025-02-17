"use server";

import { createClient } from "../../utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const { data: signUpData, error } = await supabase.auth.signUp(data);

    if (error) {
      if (error.message.includes("already registered")) {
        return {
          error: "This email is already registered",
        };
      }
      return {
        error: `Error creating your account: ${error.message}`,
      };
    }

    if (!signUpData?.user) {
      return {
        error: "Could not create your account",
      };
    }
  } catch (e: unknown) {
    return {
      error: `Error processing your request: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }
}
