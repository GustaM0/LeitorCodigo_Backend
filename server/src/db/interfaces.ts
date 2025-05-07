// User Interface
export interface User {
    name: string
    email: string
    password: string
    role: string
}

// Interface AutoAccess Token
export interface SystemConfig {
    search_id: string
    id: string
    desc: string
    group: number
    value: string
}
export interface DatabaseSchema {
    systemConfig: SystemConfig[]
    users: User[]
}