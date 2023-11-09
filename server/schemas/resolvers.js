const { Clients, Tutors } = require("../models");
const generateAuthToken = require("../utils/auth");

const resolvers = {
  Query: {
    getClients: async () => {
      try {
        const clients = Clients.find();
        if (!clients) throw new Error("No clients found");
        return clients;
      } catch (error) {
        return error;
      }
    },
    getSingleClient: async (parent, { email }) => {
      console.log("resolver started");

      try {
        const client = await Clients.findOne({ email: email });
        console.log(client);
        if (!client) throw new Error("Client not found");
        return client;
      } catch (error) {
        return error;
      }
    },
    getTutors: async () => {
      try {
        const tutors = await Tutors.find();
        if (!tutors) throw new Error("No tutors found");
        return tutors;
      } catch (error) {
        return error;
      }
    },
    getSingleTutor: async (parent, { email }) => {
      try {
        const tutor = await Tutors.findOne({ email: email });
        if (!tutor) throw new Error("No tutor matching email provided");
        return tutor;
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    clientLogin: async (parent, { loginInput: { email, password } }) => {
      try {
        const client = await Clients.findOne({ email: email });

        if (!client) throw new Error(" Email is incorrect!");
        const validPassword = await client.checkPassword(password);
        if (!validPassword) throw new Error(" Password is incorrect!");
        const token = generateAuthToken(client);

        return { ...client._doc, token };
      } catch (error) {
        return error;
      }
    },
    tutorLogin: async (parent, { loginInput: { email, password } }) => {
      try {
        const tutor = await Tutors.findOne({ email: email });
        if (!tutor) throw new Error("Email or password incorrect!");
        const validPassword = await tutor.checkPassword(password);
        if (!validPassword) throw new Error("Email or password incorrect!");
        const token = generateAuthToken(tutor);
        return { ...tutor._doc, token };
      } catch (error) {
        return error;
      }
    },
    createClient: async (parent, { ClientInput }) => {
      const client = await Clients.create(ClientInput);
      return client;
    },
    createTutor: async (parent, { TutorInput }) => {
      const tutor = await Tutors.create(TutorInput);
      return tutor;
    },
  },
};

module.exports = resolvers;
