import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Grid, Paper, Typography, TextField, Autocomplete, 
    Button, Box, Divider, Chip, Dialog, DialogTitle, 
    DialogContent, DialogActions, Stack, IconButton,
    Card, CardContent, InputAdornment, Snackbar, Alert, Tooltip, Avatar, AvatarGroup
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Dashboard({ auth, employees = [], tasks: initialTasks = [], role }) {
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [taskList, setTaskList] = useState(initialTasks);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        setTaskList(initialTasks);
        if (window.Echo) {
            window.Echo.channel('tasks').listen('TaskUpdated', (e) => {
                router.reload({ only: ['tasks'], preserveScroll: true });
            });
        }
        return () => { if (window.Echo) window.Echo.leave('tasks'); };
    }, [initialTasks]);

    const { data, setData, post, patch, processing, reset } = useForm({
        title: '',
        description: '',
        user_ids: [],
    });

    const filteredTasks = taskList.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpen = (task = null) => {
        if (task) {
            setEditId(task.id);
            setData({
                title: task.title,
                description: task.description,
                user_ids: task.users.map(u => u.id),
            });
        } else {
            setEditId(null);
            reset();
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const showNotify = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const submit = (e) => {
        e.preventDefault();
        const options = { 
            onSuccess: () => { 
                reset(); 
                showNotify(editId ? "Task updated successfully!" : "Task created successfully!", "success");
            },
            onFinish: () => {
                setOpen(false); 
            },
            preserveScroll: true,
            preserveState: true 
        };

        if (editId) {
            patch(route('tasks.update', editId), options);
        } else {
            post(route('tasks.store'), options);
        }
    };

    const handleStatusToggle = (id) => {
        router.patch(route('tasks.updateStatus', id), {}, { 
            preserveScroll: true,
            onSuccess: () => showNotify("Status changed!")
        });
    };

    const triggerConfirmDelete = (id) => {
        setTaskToDeleteId(id);
        setConfirmDeleteOpen(true);
    };

    const executeDelete = () => {
        if (!taskToDeleteId) return;
    
        router.delete(route('tasks.destroy', taskToDeleteId), { 
            preserveScroll: true,
            onFinish: () => {
                setConfirmDeleteOpen(false);
                setTaskToDeleteId(null);
                showNotify("Task removed successfully", "success"); 
            }
        });
    };

    const onDragEnd = (result) => {
        if (!result.destination || role !== 'admin') return;
        const items = Array.from(taskList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTaskList(items);
    };

    const pendingCount = taskList.filter(t => t.status === 'pending').length;
    const progressCount = taskList.filter(t => t.status === 'in_progress').length;
    const doneCount = taskList.filter(t => t.status === 'completed').length;

    // UI Helper for status colors
    const getStatusStyles = (status) => {
        switch(status) {
            case 'completed': return { bg: '#dcfce7', text: '#166534', label: 'Completed' };
            case 'in_progress': return { bg: '#e0f2fe', text: '#075985', label: 'In Progress' };
            default: return { bg: '#f1f5f9', text: '#475569', label: 'Pending' };
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        {role === 'admin' ? 'System Overview' : 'My Daily Tasks'}
                    </Typography>
                    {role === 'admin' && (
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                            sx={{ 
                                bgcolor: '#be185d', 
                                px: 3, 
                                borderRadius: '12px', 
                                fontWeight: 'bold',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#9d174d' }
                            }}
                        >
                            Create Task
                        </Button>
                    )}
                </Box>
            }
        >
            <Head title="Dashboard" />

            <Box sx={{ py: 6, minHeight: '100vh', bgcolor: '#f8fafc' }}>
                <Container maxWidth="lg">
                    {/* STATS STRIP */}
                    <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        {[
                            { label: 'Pending', count: pendingCount, color: '#64748b', bg: '#ffffff' },
                            { label: 'In Progress', count: progressCount, color: '#0284c7', bg: '#ffffff' },
                            { label: 'Completed', count: doneCount, color: '#be185d', bg: '#ffffff' }
                        ].map((stat) => (
                            <Paper key={stat.label} elevation={0} sx={{ 
                                flex: 1, p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: stat.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#f8fafc', color: stat.color, display: 'flex' }}>
                                        <AssignmentIcon fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700 }}>{stat.label}</Typography>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{stat.count}</Typography>
                            </Paper>
                        ))}
                    </Box>

                    {/* SEARCH BOX */}
                    <Box sx={{ mb: 4 }}>
                        <TextField 
                            fullWidth 
                            placeholder="Search by title or instructions..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            InputProps={{ 
                                startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>),
                                sx: { borderRadius: '12px', bgcolor: '#ffffff' }
                            }} 
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e2e8f0' } } }} 
                        />
                    </Box>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="tasks">
                            {(provided) => (
                                <Grid container spacing={3} {...provided.droppableProps} ref={provided.innerRef}>
                                    {filteredTasks.length > 0 ? filteredTasks.map((task, index) => {
                                        const status = getStatusStyles(task.status);
                                        return (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index} isDragDisabled={role !== 'admin'}>
                                            {(dragProvided) => (
                                                <Grid item xs={12} md={6} ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} sx={{ display: 'flex' }}>
                                                    <Card sx={{ 
                                                                width: '100%', 
                                                
                                                                height: 280,
                                                                display: 'flex', 
                                                                flexDirection: 'column',
                                                                borderRadius: '20px', // Slightly rounder for a premium look
                                                                border: '1px solid #e2e8f0',
                                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                                '&:hover': {
                                                                    transform: 'translateY(-6px)',
                                                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                                                                }
                                                            }} elevation={0}>
                                                                <CardContent sx={{ 
                                                                    p: 3.5, 
                                                                    height: '100%', 
                                                                    display: 'flex', 
                                                                    flexDirection: 'column' 
                                                                }}>
                                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                                                                        <Chip 
                                                                            label={status.label} 
                                                                            size="small" 
                                                                            sx={{ 
                                                                                bgcolor: status.bg, 
                                                                                color: status.text, 
                                                                                fontWeight: 800, 
                                                                                fontSize: '0.75rem',
                                                                                borderRadius: '8px',
                                                                                px: 1
                                                                            }} 
                                                                        />
                                                                        <Stack direction="row" spacing={0.5}>
                                                                            {role === 'admin' ? (
                                                                                <>
                                                                                    <IconButton onClick={() => handleOpen(task)} size="small" sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}><EditOutlinedIcon fontSize="small" /></IconButton>
                                                                                    <IconButton onClick={() => triggerConfirmDelete(task.id)} size="small" sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}><DeleteOutlineIcon fontSize="small" /></IconButton>
                                                                                </>
                                                                            ) : (
                                                                                <Button 
                                                                                    variant="contained" 
                                                                                    size="small" 
                                                                                    onClick={() => handleStatusToggle(task.id)} 
                                                                                    sx={{ 
                                                                                        bgcolor: task.status === 'completed' ? '#166534' : '#be185d', 
                                                                                        borderRadius: '10px', 
                                                                                        fontWeight: 'bold',
                                                                                        textTransform: 'none',
                                                                                        fontSize: '0.8rem',
                                                                                        boxShadow: 'none'
                                                                                    }}
                                                                                >
                                                                                    {task.status === 'pending' ? 'Start' : (task.status === 'in_progress' ? 'Done' : 'Reopen')}
                                                                                </Button>
                                                                            )}
                                                                        </Stack>
                                                                    </Box>

                                                                    {/* Title with 2-line limit */}
                                                                    <Typography variant="h6" sx={{ 
                                                                        fontWeight: 800, 
                                                                        color: '#1e293b', 
                                                                        mb: 1.5, 
                                                                        lineHeight: 1.3,
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        minHeight: '3.4rem' // Ensures titles take consistent space
                                                                    }}>
                                                                        {task.title}
                                                                    </Typography>
                                                                    
                                                                    {/* Description with 3-line limit */}
                                                                    <Typography variant="body2" sx={{ 
                                                                        color: '#64748b', 
                                                                        mb: 2,
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 3,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        flexGrow: 1 // Pushes the divider and footer to the bottom
                                                                    }}>
                                                                        {task.description}
                                                                    </Typography>

                                                                    <Divider sx={{ mb: 2.5, borderStyle: 'dashed', borderColor: '#e2e8f0' }} />

                                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                                        <AvatarGroup max={4} sx={{ 
                                                                            '& .MuiAvatar-root': { 
                                                                                width: 32, 
                                                                                height: 32, 
                                                                                fontSize: '0.85rem', 
                                                                                fontWeight: 'bold',
                                                                                border: '2px solid #fff',
                                                                                bgcolor: '#be185d'
                                                                            } 
                                                                        }}>
                                                                            {task.users.map(u => (
                                                                                <Tooltip key={u.id} title={u.name}>
                                                                                    <Avatar>{u.name.charAt(0)}</Avatar>
                                                                                </Tooltip>
                                                                            ))}
                                                                        </AvatarGroup>
                                                                        
                                                                        <Box display="flex" alignItems="center" gap={0.5} sx={{ color: '#94a3b8' }}>
                                                                            <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
                                                                            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                                                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                </Grid>
                                            )}
                                        </Draggable>
                                    )}) : (
                                        <Grid item xs={12}>
                                            <Paper sx={{ 
                                                p: 10, 
                                                textAlign: 'center', 
                                                borderRadius: '24px', 
                                                border: '2px dashed #e2e8f0', 
                                                bgcolor: 'transparent' 
                                            }} elevation={0}>
                                                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 700, mb: 1 }}>
                                                    No tasks found
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                                    Try adjusting your search or create a new task to get started.
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    )}
                                    {provided.placeholder}
                                </Grid>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Container>
            </Box>

            {/* MAIN TASK FORM MODAL */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
                <form onSubmit={submit}>
                    <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', pt: 3 }}>{editId ? 'Edit Assignment' : 'New Assignment'}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2.5} sx={{ mt: 1 }}>
                            <TextField label="Task Name" fullWidth required variant="outlined" value={data.title} onChange={e => setData('title', e.target.value)} InputProps={{ sx: { borderRadius: '10px' } }} />
                            <TextField label="Instructions" multiline rows={4} fullWidth required variant="outlined" value={data.description} onChange={e => setData('description', e.target.value)} InputProps={{ sx: { borderRadius: '10px' } }} />
                            <Autocomplete multiple options={employees} getOptionLabel={(o) => o.name} value={employees.filter(e => data.user_ids.includes(e.id))} onChange={(e, v) => setData('user_ids', v.map(u => u.id))} renderInput={(p) => <TextField {...p} label="Assign to Team" variant="outlined" />} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button onClick={handleClose} sx={{ color: '#64748b', fontWeight: 'bold' }}>Discard</Button>
                        <Button type="submit" variant="contained" disabled={processing} sx={{ bgcolor: '#be185d', borderRadius: '10px', px: 3, fontWeight: 'bold' }}>{editId ? 'Save Changes' : 'Confirm & Dispatch'}</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* DELETE CONFIRMATION MODAL */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Removal</DialogTitle>
                <DialogContent><Typography color="textSecondary">Are you sure you want to delete this task? This action is permanent.</Typography></DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setConfirmDeleteOpen(false)} sx={{ color: '#64748b', fontWeight: 'bold' }}>Cancel</Button>
                    <Button onClick={executeDelete} variant="contained" sx={{ bgcolor: '#ef4444', fontWeight: 'bold', borderRadius: '10px' }}>Delete Task</Button>
                </DialogActions>
            </Dialog>

            {/* NOTIFICATION SNACKBAR */}
            <Snackbar 
                open={notification.open} 
                autoHideDuration={3000} 
                onClose={() => setNotification({ ...notification, open: false })} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={notification.severity} variant="filled" sx={{ width: '100%', fontWeight: 'bold', borderRadius: '10px' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </AuthenticatedLayout>
    );
}

const Container = ({ children, maxWidth }) => (
    <Box sx={{ maxWidth: maxWidth === 'lg' ? '1200px' : '100%', mx: 'auto', px: 3 }}>{children}</Box>
);