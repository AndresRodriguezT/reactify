"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	try {
		const { data: signUpData, error } = await supabase.auth.signUp(data);

		console.log("Respuesta de signup:", { signUpData, error });

		if (error) {
			console.error("Error de Supabase:", error);
			if (error.message.includes("already registered")) {
				return {
					error: "Este correo ya está registrado",
				};
			}
			return {
				error: `Error al crear la cuenta: ${error.message}`,
			};
		}

		if (!signUpData?.user) {
			console.error("No hay datos de usuario en la respuesta");
			return {
				error: "No se pudo crear la cuenta",
			};
		}

		if (signUpData.user.identities?.length === 0) {
			console.log("Usuario ya existente (identities vacío)");
			return {
				error: "Este correo ya está registrado",
			};
		}

		console.log("Usuario creado exitosamente:", signUpData.user);
		revalidatePath("/", "layout");

		return {
			success: true,
			redirect: "/auth/verify",
		};
	} catch (e) {
		console.error("Error inesperado durante el registro:", e);
		return {
			error: "Error al procesar la solicitud",
		};
	}
}
