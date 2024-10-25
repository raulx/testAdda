import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import {
  addNewQuestion,
  dropQuestion,
  RootState,
  setQuestions,
  useAddQuestionMutation,
  useLazyGetAllQuestionQuery,
  useRemoveQuestionMutation,
} from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { formatDate, isFetchBaseQueryError } from "@/utils/helpers";
import ApiResponseType from "@/utils/types";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaSearch, FaSpinner, FaTrash } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImSpinner9 } from "react-icons/im";
import { UseAppDispatch } from "@/hooks/useAppDispatch";
import { useSelector } from "react-redux";

const questionSchema = z.object({
  question: z.string().min(2, {
    message: "question must be at least 2 characters.",
  }),
  options: z.object({
    a: z.string().min(2, { message: "Option is required" }),
    b: z.string().min(2, { message: "Option is required" }),
    c: z.string().min(2, { message: "Option is required" }),
    d: z.string().min(2, { message: "Option is required" }),
  }),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters",
  }),
  difficulty: z.string().min(2, { message: "Select a  Difficulty" }),
  correct_option: z.string().min(1, { message: "Select Correct Option" }),
  subject: z.string().min(2, { message: "Select Subject" }),
  explaination: z.string().min(2, {
    message: "explaination must be at least 3 characters",
  }),
});

const DeleteButton = ({ _id }: { _id: string }) => {
  const { toast } = useToast();
  const [removeQuestion, { isLoading: isDeleting }] =
    useRemoveQuestionMutation();

  const dispatch = UseAppDispatch();
  const handleDeleteQuestion = async () => {
    try {
      const res = await removeQuestion({ _id });
      console.log(res);
      if (res.data) {
        dispatch(dropQuestion(res.data?.data._id));
        return toast({
          title: "Success",
          description: "Sucessfully Deleted Question",
        });
      }

      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<object>;
        return toast({
          title: "Error",
          description: serverError.message,
          variant: "destructive",
        });
      } else {
        return toast({
          title: "Error Adding Test",
          description: "err",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button onClick={handleDeleteQuestion} disabled={isDeleting}>
      {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
    </button>
  );
};
const AddQuestionScreen = () => {
  const [addQuestion, { isLoading }] = useAddQuestionMutation();
  const [getAllQuestions, { isLoading: isFetching }] =
    useLazyGetAllQuestionQuery();

  const questions = useSelector((store: RootState) => {
    return store.questions;
  });

  const dispatch = UseAppDispatch();
  const { toast } = useToast();
  const [value, setValue] = useState("All");
  const [questionNumber, setQuestionNumber] = useState(0);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      options: { a: "", b: "", c: "", d: "" },
      topic: "",
      subject: "",
      difficulty: "",
      correct_option: "",
      explaination: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof questionSchema>) {
    try {
      const res = await addQuestion(values);
      if (res.data) {
        dispatch(addNewQuestion(res.data.data));
        return toast({
          title: "Sucessfully added",
          description: res.data?.message,
        });
      }
      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<object>;
        return toast({
          title: "Error",
          description: serverError.message,
          variant: "destructive",
        });
      } else {
        return toast({
          title: "Error Adding Test",
          description: "err",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
    console.log(values);
  }

  useEffect(() => {
    const fetchAllQuestion = async () => {
      try {
        const res = await getAllQuestions(null);
        console.log(res);
        if (res.data) {
          dispatch(setQuestions(res.data?.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllQuestion();
  }, [dispatch, getAllQuestions]);

  return (
    <div className="h-full w-full flex p-4 gap-3">
      <div className="bg-white rounded shadow-custom-2 flex flex-col gap-4 p-4 w-[40%] max-h-fit">
        <h1 className="text-center">Add New Question</h1>
        <div className="bg-gray-50 px-4 py-6 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className=" flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <FormLabel>Options</FormLabel>
                <div className="flex gap-4 flex-wrap">
                  <FormField
                    control={form.control}
                    name="options.a"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option A" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.b"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option B" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.c"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option C" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.d"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option D" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="correct_option"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Option</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Correct Option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="b">B</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="d">D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="reasoning">Reasoning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="explaination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explaination</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Explaination..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-lightseagreen font-bold hover:bg-lightseagreen">
                {isLoading ? (
                  <span className="loader h-4 w-4"></span>
                ) : (
                  <>
                    <HiOutlineDocumentAdd />
                    Add
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      {isFetching ? (
        <div className="w-[60%] h-[600px] flex justify-center items-center">
          <ImSpinner9 className="animate-spin text-3xl text-lightseagreen" />
        </div>
      ) : (
        <div className=" w-[60%] flex flex-col gap-4">
          <div className="p-6 text-sm border min-h-48 rounded-xl shadow-custom-2 border-gray-300 flex flex-col gap-4 bg-white">
            <h1>Q) {questions.data[questionNumber].question}</h1>
            <div className="flex gap-4 ">
              <div>a) {questions.data[questionNumber].options.a}</div>
              <div>b) {questions.data[questionNumber].options.b}</div>
            </div>
            <div className="flex gap-4">
              <div>c) {questions.data[questionNumber].options.c}</div>
              <div>d) {questions.data[questionNumber].options.d}</div>
            </div>
          </div>
          <div className="p-6 text-sm border rounded-xl border-gray-300 bg-white shadow-custom-2">
            <div className="flex gap-4">
              <div className="grow flex flex-col gap-2">
                <Label htmlFor="question input">Search By Question</Label>
                <div className="flex gap-2 grow">
                  <Input id="question input" placeholder="Enter Question" />
                  <Button className="bg-lightseagreen hover:bg-lightseagreen">
                    <FaSearch />
                  </Button>
                </div>
              </div>
              <div className="min-w-48 flex flex-col gap-2">
                <Label>Select Subject</Label>
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Reasoning">Reasoning</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <hr className="h-[2px] bg-gray-300 my-6" />
            <ScrollArea className="  h-[600px] px-2">
              <Table className="text-xs">
                <TableCaption>
                  All Questions Present in the Database
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-lightseagreen hover:bg-lightseagreen">
                    <TableHead className="text-white">Added On</TableHead>
                    <TableHead className="text-white">Quiz Id</TableHead>
                    <TableHead className="text-white">Difficulty</TableHead>
                    <TableHead className="text-white">Subject</TableHead>
                    <TableHead className="text-white">Topic</TableHead>
                    <TableHead className="text-white">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions?.data.map((d, index: number) => {
                    return (
                      <TableRow
                        key={d._id}
                        onClick={() => setQuestionNumber(index)}
                        className={`cursor-pointer  my-2 ${
                          questionNumber === index && "bg-gray-100"
                        }`}
                      >
                        <TableCell>{formatDate(d.createdAt)}</TableCell>
                        <TableCell>
                          {d.quiz_id ? (
                            d.quiz_id
                          ) : (
                            <span className="w-full flex justify-center items-center text-xl">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{d.difficulty}</TableCell>
                        <TableCell>{d.subject}</TableCell>
                        <TableCell>{d.topic}</TableCell>
                        <TableCell>
                          <DeleteButton _id={d._id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestionScreen;
