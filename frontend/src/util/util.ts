export const getStatusColor = (status: string) => {
    switch (status) {
        case "To Do":
            return "bg-blue-500";
        case "In Progress":
            return "bg-yellow-500";
        case "Done":
            return "bg-green-500";
        default:
            return "bg-gray-500";
    }
};

export const getRoleBadgeVariant = (role: string) => {
    switch (role) {
        case "Admin":
            return "destructive";
        case "Project Manager":
            return "default";
        default:
            return "secondary";
    }
};

export const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};
