const { Thought } = require('../models');

const thoughtController = {
    // GET all thoughts
    getAllThoughts (req,res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({_id: -1})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },
    //GET one thought by ID
    getThought({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res
                        .status(404)
                        .json({ message: 'Thought not found!'})
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    //CREATE thought
    createThought (body, res) {
        Thought.create(body)
            .then(({_id})=>{
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id} },
                    { new: true }
                )
            })
            .then((dbUserData) => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'User not found!' });
                    return;
                }
                res.json(dbUserData)
            })
            .catch((err) => res.json(err))
    },
    //UPDATE thought
    updateThought ({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'Thought not found!' })
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(err))
    },
    //DELETE thought
    deleteThought ({ params }, res) {
        Thought.findOneAndDelete({_id: params.id})
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'Thought not found!'})
                }
                return User.findOneAndUpdate(
                    { thoughts: params.id },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                )
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'User not found!' })
                }
                res.json({ message: 'Thought deleted!' })
            })
            .catch((err) => res.json(err));
    },

    //CREATE reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body} },
            { new: true, runValidators: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'Thought not found!'})
                    return;
                }            
            res.json(dbThoughtData);
            })
            .catch((err)=>res.json(err))     
    },
    //DELETE reaction
    deleteReaction({params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: {reactionId: params.reactionId } } },
            { new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'Thought not found!' })
                }
                res.json(dbThoughtData)
            })
            .catch((err) => res.json(err));
    }
}

module.exports = thoughtController;