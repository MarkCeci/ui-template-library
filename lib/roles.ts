export type UserRole = "viewer" | "designer" | "developer" | "admin";

export type Permission =
  | "view"
  | "maintain_styles"
  | "maintain_templates"
  | "maintain_tokens"
  | "maintain_components"
  | "maintain_code_links"
  | "review"
  | "publish"
  | "deprecate";

export const roleDescriptions: Record<UserRole, string> = {
  viewer: "只能查看风格、模板、组件和推荐结果。",
  designer: "可维护风格包、模板预览、Token、Figma 链接和设计验收项。",
  developer: "可维护组件、Storybook、代码链接和开发交付说明。",
  admin: "可审核、发布、废弃数据，并负责上线质量把关。",
};

export const rolePermissions: Record<UserRole, Permission[]> = {
  viewer: ["view"],
  designer: ["view", "maintain_styles", "maintain_templates", "maintain_tokens"],
  developer: ["view", "maintain_components", "maintain_code_links"],
  admin: [
    "view",
    "maintain_styles",
    "maintain_templates",
    "maintain_tokens",
    "maintain_components",
    "maintain_code_links",
    "review",
    "publish",
    "deprecate",
  ],
};

export function can(role: UserRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
