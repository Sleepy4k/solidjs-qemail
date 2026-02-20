import { Component, JSX } from "solid-js";
import { Card } from "../../../../shared/components/ui";
import { useAnimation } from "../../../../shared/hooks/use-animation.hook";

export interface StatsCardProps {
  label: string;
  value: number | string;
  icon: JSX.Element;
  color: string;
  delay?: number;
}

const StatsCard: Component<StatsCardProps> = (props) => {
  let cardRef: HTMLDivElement | undefined;

  useAnimation(() => cardRef, {
    animation: "scaleIn",
    duration: 0.5,
    delay: props.delay || 0,
  });

  return (
    <div ref={cardRef}>
      <Card hover padding="lg" shadow="md">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-2">{props.label}</p>
            <p class="text-4xl font-bold text-gray-900 tabular-nums">
              {props.value}
            </p>
          </div>
          <div
            class={`${props.color} text-white p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110`}
          >
            {props.icon}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCard;
