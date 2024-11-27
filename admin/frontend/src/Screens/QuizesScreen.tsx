import { Link, Outlet, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaEye, FaPlus, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AllQuestion, QuestionData, RootState } from "@/store/store";
import { useState } from "react";
import { ImCheckmark } from "react-icons/im";
import Modal from "react-modal";

Modal.setAppElement("#root");

const quizSchema = z.object({
  title: z
    .string()
    .min(2, { message: "title must be of atleast 2 characters." }),
  description: z
    .string()
    .min(2, { message: "description must be of atleast 2 characters." }),
  duration: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().positive("Duration must be a positive number.")
  ),

  difficulty: z.string().min(2, { message: "difficulty must be selected" }),
  access_type: z.enum(["free", "paid"], {
    required_error: "You need to select an access type",
  }),
});

const QuizScreenMain = () => {
  const location = useLocation().pathname;

  return (
    <div>
      <div className="flex gap-4 max-w-fit bg-white mx-auto justify-center items-center border-2 py-2 px-4 text-sm rounded-lg mt-2">
        <div className={`${location === "/quizes" && "border-b-2"}`}>
          <Link to={"/quizes"}>Quizes</Link>
        </div>
        <div className={`${location === "/quizes/add/new" && "border-b-2"}`}>
          <Link to={"/quizes/add/new"}>Add New Quizes</Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

const AddNewQuizScreen = () => {
  const questions = useSelector((store: RootState) => {
    return store.questions;
  });
  const availableQuestions = questions.data.filter((d) => !d.quiz_id);
  const [selectedQuestions, setSelectedQuestions] = useState<AllQuestion>([]);
  const [viewQuestionModel, setViewQuestionModel] = useState(false);
  const [openedQuestion, setOpenedQuestion] = useState<QuestionData>({
    avg_solving_time: "",
    correct_option: "",
    createdAt: "",
    difficulty: "",
    explaination: "",
    options: { a: "", b: "", c: "", d: "" },
    question: "",
    subject: "",
    topic: "",
    quiz_id: "",
    exam: "",
    updatedAt: "",
    _id: "",
    __v: 0,
  });
  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 0,
      difficulty: "",
    },
  });

  const handleQuestionAdd = (ques: QuestionData) => {
    setSelectedQuestions((prevValue) => {
      return [...prevValue, ques];
    });
  };
  const handleQuestionRemove = (id: string) => {
    setSelectedQuestions((prevValue) => {
      return [...prevValue].filter((d) => d._id != id);
    });
  };
  async function handleFormSubmit(values: z.infer<typeof quizSchema>) {
    console.log(values);
    form.reset();
  }

  const openViewQuestionModel = (ques: QuestionData) => {
    setOpenedQuestion(ques);
    setViewQuestionModel(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4 bg-[#F6F3F3] m-4 rounded-xl px-4 py-8">
        <div className="max-w-fit mx-auto">Add New Quiz</div>
        <div className="flex gap-2">
          <div className="w-1/2 mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col gap-16 bg-[#E6F3F3]  px-8 py-16 border rounded-xl"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Quiz Title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter description Here"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter duration in seconds"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
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
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <div className="mt-4">
                  <FormField
                    name="access_type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col gap-8">
                          <FormLabel>Select Access Type : </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <div className="flex gap-4  items-center ">
                                <FormItem>
                                  <div className="flex gap-2 items-center">
                                    <FormLabel>Free</FormLabel>
                                    <FormControl>
                                      <RadioGroupItem value="free" />
                                    </FormControl>
                                  </div>
                                </FormItem>
                                <FormItem>
                                  <div className="flex gap-2 items-center">
                                    <FormLabel>Paid</FormLabel>
                                    <FormControl>
                                      <RadioGroupItem value="paid" />
                                    </FormControl>
                                  </div>
                                </FormItem>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button className="bg-lightseagreen font-bold hover:bg-lightseagreen">
                  <HiOutlineDocumentAdd />
                  Add Quiz
                </Button>
              </form>
            </Form>
          </div>
          <div className="w-1/2  flex flex-col p-4 justify-between gap-4">
            <div className="h-[400px] border bg-white w-full rounded-lg py-2">
              <div className="p-2 max-w-fit mx-auto">Questions Selected</div>
              <div className="text-sm max-w-fit ml-auto mr-8">
                Total Selected : {selectedQuestions.length}
              </div>
              <div className="p-4 flex flex-col gap-2 h-[320px] overflow-x-hidden overflow-y-scroll scrollbar-thin">
                <div className="flex  bg-lightseagreen text-white justify-between  rounded">
                  <div className="flex w-12 justify-center items-center">
                    S.No
                  </div>
                  <div className="flex w-24 justify-center items-center">
                    Exam
                  </div>
                  <div className="flex w-24 justify-center items-center">
                    Difficulty
                  </div>
                  <div className="flex w-24 justify-center items-center">
                    Subject
                  </div>
                  <div className="flex w-24 justify-center items-center">
                    Topic
                  </div>
                  <div className="flex w-16 justify-center items-center">
                    View
                  </div>
                  <div className="flex w-20 justify-center items-center">
                    Remove
                  </div>
                </div>
                {selectedQuestions.map((ques, index) => {
                  return (
                    <div>
                      <div className="flex  border border-gray-400  rounded">
                        <div className="w-12 flex justify-center items-center">
                          {index + 1}.
                        </div>
                        <div className="w-24 flex justify-center items-center">
                          {ques.exam}
                        </div>
                        <div className="w-24 flex justify-center items-center">
                          {ques.difficulty}
                        </div>
                        <div className="w-24 flex justify-center items-center">
                          {ques.subject}
                        </div>
                        <div className="w-24 flex justify-center items-center">
                          {ques.topic}
                        </div>
                        <div
                          onClick={() => openViewQuestionModel(ques)}
                          className="cursor-pointer w-16 flex justify-center items-center"
                        >
                          <FaEye />
                        </div>
                        <div
                          onClick={() => handleQuestionRemove(ques._id)}
                          className="cursor-pointer w-20 flex justify-center items-center"
                        >
                          <FaTimes />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {selectedQuestions.length === 0 && (
                  <div className="my-4 max-w-fit mx-auto text-gray-500">
                    Please Select Questions From Below Available Questions
                  </div>
                )}
              </div>
            </div>
            <div className="border h-[500px] w-full bg-white rounded-lg">
              <div className="font-bold text-xl max-w-fit mx-auto mt-4">
                Available Questions
              </div>
              <div className="flex items-center gap-4 p-4">
                <Input placeholder="Search By Exam" />
                <Button className="bg-lightseagreen text-white">Search</Button>
              </div>
              <hr className="h-2" />
              <div className="p-4 flex flex-col gap-2 h-[360px] overflow-x-hidden overflow-y-scroll scrollbar-thin">
                <div className="flex bg-lightseagreen text-white justify-between rounded">
                  <div className="w-12 flex justify-center items-center">
                    S.No
                  </div>
                  <div className="w-24 flex justify-center items-center">
                    Exam
                  </div>
                  <div className="w-24 flex justify-center items-center">
                    Difficulty
                  </div>
                  <div className="w-24 flex justify-center items-center">
                    Subject
                  </div>
                  <div className="w-24 flex justify-center items-center">
                    Topic
                  </div>
                  <div className="w-16 flex justify-center items-center">
                    View
                  </div>
                  <div className="w-20 flex justify-center items-center">
                    Add
                  </div>
                </div>
                {availableQuestions.map((ques, index) => {
                  return (
                    <div className="flex  border border-gray-400 bg-white justify-between  items-center rounded">
                      <div className="w-12 flex justify-center items-center">
                        Q.{index + 1}
                      </div>
                      <div className="w-24 flex justify-center items-center">
                        {ques.exam}
                      </div>
                      <div className="w-24 flex justify-center items-center">
                        {ques.difficulty}
                      </div>
                      <div className="w-24 flex justify-center items-center">
                        {ques.subject}
                      </div>
                      <div className="w-24 flex justify-center items-center">
                        {ques.topic}
                      </div>
                      <div
                        onClick={() => openViewQuestionModel(ques)}
                        className="cursor-pointer w-16 flex justify-center items-center"
                      >
                        <FaEye />
                      </div>
                      {selectedQuestions.find((q) => q._id === ques._id) ? (
                        <div className="flex justify-center items-center w-20">
                          <ImCheckmark />
                        </div>
                      ) : (
                        <div
                          onClick={() => handleQuestionAdd(ques)}
                          className="cursor-pointer flex justify-center items-center w-20"
                        >
                          <FaPlus />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={viewQuestionModel}
        className="bg-white py-6 px-4 w-[600px] rounded-2xl border border-[#E6F3F3] relative"
        overlayClassName="fixed h-screen w-screen inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      >
        <div className="flex flex-col gap-6">
          <div className="max-w-fit text-2xl uppercase mx-auto font-semibold border-b border-black text-[#38A3A5]">
            {openedQuestion.exam}
          </div>
          <hr className="h-1  bg-[#E6F3F3]" />
          <div className="flex gap-2">
            <div>Question:- </div>
            <div>{openedQuestion.question}</div>
          </div>
          <div className="flex gap-2">
            <div>Options:-</div>
            <div className="flex flex-col gap-2">
              <div>a) {openedQuestion.options.a}</div>
              <div>b) {openedQuestion.options.b}</div>
              <div>c) {openedQuestion.options.c}</div>
              <div>d) {openedQuestion.options.d}</div>
            </div>
          </div>
          <div>Correct Option : {openedQuestion.correct_option}</div>
          <hr className="h-1 bg-[#E6F3F3]" />
          <div className="flex gap-2 border-4 border-[#E6F3F3] rounded-lg p-2">
            <div>Explaination:-</div>
            <div>{openedQuestion.explaination}</div>
          </div>
        </div>
        <button
          onClick={() => setViewQuestionModel(false)}
          className="absolute right-2 top-2 "
        >
          <FaTimes />
        </button>
      </Modal>
    </>
  );
};

export default QuizScreenMain;
export { AddNewQuizScreen };
