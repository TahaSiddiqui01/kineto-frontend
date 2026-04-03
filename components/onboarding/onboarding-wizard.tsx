"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { routes } from "@/types/routes/routes.client"
import { workspaceService } from "@/services/workspace.service"
import { userService } from "@/services/user.service"
import { useAuthStore } from "@/store/auth.store"

import { WorkspaceInfoStep, type WorkspaceInfoValues } from "./steps/workspace-info-step"
import { WorkspaceImageStep, type WorkspaceImageValues } from "./steps/workspace-image-step"
import { PurposeStep } from "./steps/purpose-step"
import { ReferralStep } from "./steps/referral-step"
import { InviteStep } from "./steps/invite-step"
import type { WorkspacePurpose, ReferralSource } from "@/types/auth"

type Step = "workspace-info" | "workspace-image" | "purpose" | "referral" | "invite"

const STEPS: Step[] = ["workspace-info", "workspace-image", "purpose", "referral", "invite"]

interface State {
    workspaceInfo: WorkspaceInfoValues | null
    imageValues: WorkspaceImageValues
    purpose: WorkspacePurpose | null
    referralSource: ReferralSource | null
}

export function OnboardingWizard() {
    const router = useRouter()
    const setCurrentWorkspace = useAuthStore((s) => s.setCurrentWorkspace)
    const [currentStep, setCurrentStep] = useState<Step>("workspace-info")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [state, setState] = useState<State>({
        workspaceInfo: null,
        imageValues: { logoUrl: null, logoFileId: null },
        purpose: null,
        referralSource: null,
    })

    const stepIndex = STEPS.indexOf(currentStep)
    const progress = ((stepIndex + 1) / STEPS.length) * 100

    const next = (step: Step) => setCurrentStep(step)

    const finish = async (inviteEmails: string[]) => {
        if (!state.workspaceInfo) return
        setIsSubmitting(true)

        try {
            const [{ data: workspace }] = await Promise.all([
                workspaceService.createWorkspace({
                    name: state.workspaceInfo.name,
                    industry: state.workspaceInfo.industry,
                    logoUrl: state.imageValues.logoUrl,
                    logoFileId: state.imageValues.logoFileId,
                }),
                userService.updatePrefs({
                    purpose: state.purpose,
                    referralSource: state.referralSource,
                    onboardingCompleted: true,
                }),
            ])

            setCurrentWorkspace(workspace)

            if (inviteEmails.length > 0) {
                await workspaceService
                    .inviteMembers(workspace.id, inviteEmails)
                    .catch(() => toast.error("Some invitations could not be sent"))
            }

            toast.success("Workspace created!", {
                description: `Welcome to ${workspace.name}.`,
            })
            router.replace(routes.workspace.home())
        } catch {
            toast.error("Failed to create workspace", {
                description: "Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg">
                {/* Progress bar */}
                <div className="mb-8">
                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div
                            className="h-1.5 rounded-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="mt-2 text-right text-xs text-gray-400">
                        Step {stepIndex + 1} of {STEPS.length}
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    {currentStep === "workspace-info" && (
                        <WorkspaceInfoStep
                            defaultValues={state.workspaceInfo ?? undefined}
                            onNext={(values) => {
                                setState((s) => ({ ...s, workspaceInfo: values }))
                                next("workspace-image")
                            }}
                        />
                    )}

                    {currentStep === "workspace-image" && (
                        <WorkspaceImageStep
                            onNext={(values) => {
                                setState((s) => ({ ...s, imageValues: values }))
                                next("purpose")
                            }}
                            onSkip={() => next("purpose")}
                        />
                    )}

                    {currentStep === "purpose" && (
                        <PurposeStep
                            onNext={(purpose) => {
                                setState((s) => ({ ...s, purpose }))
                                next("referral")
                            }}
                        />
                    )}

                    {currentStep === "referral" && (
                        <ReferralStep
                            onNext={(referralSource) => {
                                setState((s) => ({ ...s, referralSource }))
                                next("invite")
                            }}
                        />
                    )}

                    {currentStep === "invite" && (
                        <InviteStep
                            isSubmitting={isSubmitting}
                            onNext={finish}
                            onSkip={() => finish([])}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
