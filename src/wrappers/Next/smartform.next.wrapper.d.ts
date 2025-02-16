import { FC } from "react";

export interface SmartFormNextProps {
  schema: Record<string, any>;
  onSubmit?: (data: any) => void;
}

declare const SmartFormNext: FC<SmartFormNextProps>;

export default SmartFormNext;
