import { FC } from "react";

export interface SmartFormIOProps {
  schema: Record<string, any>;
  disableDefaultStyles?: boolean;
  onSubmit?: (data: any) => void;
}

declare const SmartFormReact: FC<SmartFormIOProps>;

export default SmartFormReact;
