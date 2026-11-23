export type ContainerActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialContainerActionState: ContainerActionState = {};
