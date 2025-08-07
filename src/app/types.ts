// src/types.ts

export interface User {
    id: string;
    email?: string;
    created_at?: string;
    last_sign_in_at?: string;
    user_metadata?: {
        full_name?: string;
        phone_number?: string;
        user_type?: 'CLIENT' | 'DRIVER' | 'DRIVER_MANAGER' | 'ADMIN' | 'SUPPORT';
        // Add other user_metadata properties here
    };
    app_metadata?: {
        provider?: string;
        role?: 'CLIENT' | 'DRIVER' | 'DRIVER_MANAGER' | 'ADMIN' | 'SUPPORT';
        // Add other app_metadata properties here
    };
    // Add other user properties here
}