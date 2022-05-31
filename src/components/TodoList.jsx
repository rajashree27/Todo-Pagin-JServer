import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Box,
	Button,
	Divider,
	Flex,
	Input,
	Select,
	Spacer,
	useDisclosure,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";

const TodoList = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState("");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(3);
	const [countTotal, setCountTotal] = useState(0);

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const getTodo = async () => {
			let r = await axios.get(
				`http://localhost:8080/todos?_page=${page}&_limit=${limit}`
			);
			//console.log(r.data);
			setTodos(r.data);
			setCountTotal(Number(r.headers["x-total-count"]));
		};
		getTodo();
	}, [page, limit]);

	const saveInfo = () => {
		fetch("http://localhost:8080/todos", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ title: newTodo, isCompleted: false }),
		})
			.then((r) => r.json())
			.then((d) => {
				setTodos([...todos, d]);
				setNewTodo("");
			});
	};

	const deleteInfo = (el) => {
		fetch("http://localhost:8080/todos/" + el.id, {
			method: "DELETE",
		})
			.then((r) => r.json())
			.then((d) => {
				setTodos(todos.filter((ele) => ele.id !== el.id));
			});
	};

	return (
		<div>
			<Box
				bg="black"
				w="50%"
				p={5}
				color="white"
				margin="auto"
				mt="5%"
				borderRadius="20px"
			>
				<Text fontSize="3xl">Todo List</Text>
				<Divider orientation="horizontal" />

				{todos.map((el) => {
					return (
						<Flex
							minWidth="max-content"
							alignItems="center"
							gap="2"
							key={el.id}
						>
							<Box p="4">
								<Text size="md">{el.title}</Text>
							</Box>
							<Spacer />
							<Button
								size="sm"
								colorScheme="green"
								onClick={() => deleteInfo(el)}
							>
								Mark as completed
							</Button>
						</Flex>
					);
				})}
				<Button onClick={onOpen} size="sm" colorScheme="facebook" mt="10%">
					Add new Todo
				</Button>

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Add your todo</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Input
								placeholder="Enter here..."
								value={newTodo}
								onChange={(e) => setNewTodo(e.target.value)}
							/>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={saveInfo}>
								Save
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				<Flex alignItems="center" justifyContent="center" gap="15px" mt="10%">
					<Button
						colorScheme="pink"
						size="xs"
						disabled={page <= 1}
						onClick={() => setPage(page - 1)}
					>
						Prev
					</Button>
					<Select
						w="80px"
						size="xs"
						bg="white"
						color="black"
						onChange={(e) => setLimit(Number(e.target.value))}
					>
						<option value={3} size="sm">
							3
						</option>
						<option value={5} size="sm">
							5
						</option>
						<option value={10} size="sm">
							10
						</option>
					</Select>
					<Button
						colorScheme="pink"
						size="xs"
						disabled={countTotal < page * limit}
						onClick={() => setPage(page + 1)}
					>
						Next
					</Button>
				</Flex>
			</Box>
		</div>
	);
};

export default TodoList;
