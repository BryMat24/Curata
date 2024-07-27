"use client";
import { FunctionComponent } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/axios";

interface Props {}

const formSchema = z.object({
    courseName: z.string().min(3).max(50),
    courseUnits: z.array(z.string()),
});

const CourseCreate: FunctionComponent<Props> = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            courseName: "",
            courseUnits: [""],
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
        data
    ) => {
        try {
            const res = await apiClient.post("/course", data);
            toast({
                title: "Successful",
                description: "Course created successfully!",
            });

            router.push(`/course/create/${res?.data?.course?.id}`);
        } catch (err) {
            toast({
                title: "Error occured!",
                description: `${err}`,
            });
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="min-w-[40vw] rounded-lg border px-8 py-8 shadow-md">
                <Form {...form}>
                    <h1 className="text-2xl font-bold">
                        Choose any topic that you want to learn...
                    </h1>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="courseName"
                            render={({ field }) => (
                                <>
                                    <FormItem className="flex items-center gap-5 mt-5">
                                        <FormLabel className="text-xl font-semibold w-[80px]">
                                            Title
                                        </FormLabel>
                                        <div className="flex-grow">
                                            <FormControl>
                                                <Input
                                                    className="shadow-sm"
                                                    placeholder="Enter the main topic of the course"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1" />
                                        </div>
                                    </FormItem>
                                </>
                            )}
                        />

                        <AnimatePresence>
                            {form.watch("courseUnits").map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        opacity: { duration: 0.2 },
                                        height: { duration: 0.2 },
                                    }}
                                >
                                    <FormField
                                        control={form.control}
                                        key={index}
                                        name={`courseUnits.${index}`}
                                        render={({ field }) => (
                                            <>
                                                <FormItem className="flex items-center gap-5 mt-2">
                                                    <FormLabel className="text-xl font-semibold w-[80px]">
                                                        Unit {index + 1}
                                                    </FormLabel>
                                                    <div className="flex-grow">
                                                        <FormControl>
                                                            <Input
                                                                className="shadow-sm"
                                                                placeholder="Enter the subtopic of this course"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="mt-1" />
                                                    </div>
                                                </FormItem>
                                            </>
                                        )}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="flex justify-center items-center gap-2 mt-5">
                            <Separator className="flex-grow" />
                            <Button
                                type="button"
                                className="bg-[#F5F5F4] px-5 py-2 rounded-md font-semibold flex items-center text-black"
                                onClick={() => {
                                    form.setValue("courseUnits", [
                                        ...form.watch("courseUnits"),
                                        "",
                                    ]);
                                }}
                            >
                                Add Unit
                                <Plus className="ml-2 h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                                type="button"
                                className="bg-[#F5F5F4] px-5 py-2 rounded-md font-semibold flex items-center text-black"
                                onClick={() => {
                                    form.setValue(
                                        "courseUnits",
                                        form.watch("courseUnits").slice(0, -1)
                                    );
                                }}
                            >
                                Remove Unit
                                <Trash className="ml-2 h-4 w-4 text-red-500" />
                            </Button>
                            <Separator className="flex-grow" />
                        </div>
                        <Button
                            className="w-full mt-5 font-bold"
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? "Generating Course..."
                                : "Let's Go!"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CourseCreate;
