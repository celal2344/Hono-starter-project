import { Badge } from '@/components/ui/badge';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Check, LoaderCircleIcon, type LucideIcon } from 'lucide-react';

interface Step {
  title: string;
  icon: LucideIcon;
  description?: string;
}

interface TitleStatusStepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export default function TitleStatusStepper({ steps, currentStep, onStepChange, className }: TitleStatusStepperProps) {
  return (
    <Stepper
      value={currentStep}
      onValueChange={onStepChange}
      indicators={{
        completed: <Check className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
      className={className}
    >
      <StepperNav className="gap-3">
        {steps.map((step, index) => {
          return (
            <StepperItem key={index} step={index + 1} className="relative flex-1 items-start">
              <StepperTrigger className="flex flex-col items-start justify-center gap-2.5 grow" asChild>
                <StepperIndicator className="size-8 border-2 data-[state=completed]:text-white data-[state=completed]:bg-primary data-[state=completed]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=inactive]:bg-transparent data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground">
                  <step.icon className="size-4" />
                </StepperIndicator>
                <div className="flex flex-col items-start gap-1">
                  <div className="text-[10px] font-semibold uppercase text-muted-foreground">Step {index + 1}</div>
                  <StepperTitle className="text-start text-sm font-semibold group-data-[state=inactive]/step:text-muted-foreground">
                    {step.title}
                  </StepperTitle>
                  {step.description && (
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  )}
                  <div>
                    <Badge
                      variant="primary"
                      size="sm"
                      appearance="light"
                      className="hidden group-data-[state=active]/step:inline-flex"
                    >
                      In Progress
                    </Badge>

                    <Badge
                      variant="success"
                      size="sm"
                      appearance="light"
                      className="hidden group-data-[state=completed]/step:inline-flex"
                    >
                      Completed
                    </Badge>

                    <Badge
                      variant="secondary"
                      size="sm"
                      className="hidden group-data-[state=inactive]/step:inline-flex text-muted-foreground"
                    >
                      Pending
                    </Badge>
                  </div>
                </div>
              </StepperTrigger>

              {steps.length > index + 1 && (
                <StepperSeparator className="absolute top-4 inset-x-0 start-9 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none data-[state=completed]/step:bg-primary" />
              )}
            </StepperItem>
          );
        })}
      </StepperNav>
    </Stepper>
  );
}
