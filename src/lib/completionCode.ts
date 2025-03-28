import { createClient } from '@supabase/supabase-js';

// Function to generate a random string of specified length
const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Function to generate a unique completion code
export const generateUniqueCompletionCode = async (supabase: any): Promise<string> => {
    const codeLength = 8;
    let isUnique = false;
    let completionCode = '';

    while (!isUnique) {
        completionCode = generateRandomString(codeLength);
        
        // Check if the code already exists
        const { data, error } = await supabase
            .from('completion_codes')
            .select('completion_code')
            .eq('completion_code', completionCode)
            .single();

        if (error && error.code === 'PGRST116') {
            // No matching record found, code is unique
            isUnique = true;
        }
    }

    return completionCode;
};

// Function to save completion code for a user
export const saveCompletionCode = async (
    supabase: any,
    userId: string,
    completionCode: string
): Promise<{ success: boolean; error?: any }> => {
    try {
        const { error } = await supabase
            .from('completion_codes')
            .insert([
                {
                    user_id: userId,
                    completion_code: completionCode,
                }
            ]);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}; 