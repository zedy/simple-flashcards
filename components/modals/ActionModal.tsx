import Text from "@/components/text/Text";
import type { ButtonSize, ButtonVariant } from "@/types";

import Button from "../buttons/Button";
import type { ModalProps } from "./Modal";
import Modal from "./Modal";

interface ActionModalAction {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  className?: string;
}

export interface ActionModalProps extends ModalProps {
  heading: string;
  description: string;
  primaryAction: ActionModalAction;
  secondaryAction?: ActionModalAction;
  buttonSize?: ButtonSize;
  textAlign?: "left" | "center" | "right";
  showCloseButton?: boolean;
}

export const ActionModal = ({
  heading,
  description,
  primaryAction,
  secondaryAction,
  buttonSize = "default",
  textAlign = "left",
  ...modalProps
}: ActionModalProps) => {
  return (
    <Modal {...modalProps}>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Text>{heading}</Text>
          <Text>{description}</Text>
        </div>

        <div className="flex w-full flex-wrap gap-4 pt-1">
          {secondaryAction && (
            <Button
              variant={secondaryAction?.variant ?? "secondary"}
              size={buttonSize}
              onPress={secondaryAction?.onPress}
              label={secondaryAction?.label}
            />
          )}

          <Button
            variant={primaryAction?.variant ?? "primary"}
            size={buttonSize}
            label={primaryAction.label}
            onPress={primaryAction.onPress}
          />
        </div>
      </div>
    </Modal>
  );
};
