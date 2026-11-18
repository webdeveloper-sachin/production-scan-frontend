import { useFetch } from '../../hooks/useFetch';
import { useAction } from '../../hooks/useAction';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/employee.service';
import { getRoles } from '../../services/role.service';
import PageTitle from '../../components/ui/PageTitle.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';

export default function TeamPage() {
  const state = useFetch(() => Promise.all([getEmployees(), getRoles()]));
  const run = useAction();

  const add = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    const res = await run(() => createEmployee({ name: f.name.trim(), role_id: Number(f.role_id) }), 'Employee created');
    if (res) { form.reset(); state.refetch(); }
  };
  const changeRole = async (id, role_id) => {
    if (await run(() => updateEmployee(id, { role_id: Number(role_id) }), 'Role updated')) state.refetch();
  };
  const remove = async (e) => {
    if (!window.confirm(`Remove ${e.name}? Employees who already scanned orders cannot be removed.`)) return;
    if (await run(() => deleteEmployee(e.id), 'Removed')) state.refetch();
  };

  return (
    <>
      <PageTitle>Team</PageTitle>
      <p className="-mt-2 mb-4 text-sm text-ink/60">Employees log in with their ID. Share the ID with the employee after creating them.</p>
      <Async state={state}>
        {([employees, roles]) => (
          <>
            <Card as="form" onSubmit={add} className="mb-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input name="name" placeholder="Employee name" required />
              <Select name="role_id" aria-label="Role">{roles.map((r) => <option key={r.id} value={r.id}>{r.role_name}</option>)}</Select>
              <Button>Create employee</Button>
            </Card>

            {employees.length ? (
              <Card as="ul" className="divide-y divide-ink/10">
                {employees.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-3 py-3">
                    <span className="rounded-lg bg-ink px-2.5 py-1 font-display text-sm font-extrabold text-tape">ID {e.id}</span>
                    <p className="min-w-0 flex-1 truncate font-bold">{e.name}</p>
                    <Select value={e.role_id} onChange={(ev) => changeRole(e.id, ev.target.value)} className="!w-auto !py-2 capitalize" aria-label={`Role of ${e.name}`}>
                      {roles.map((r) => <option key={r.id} value={r.id}>{r.role_name}</option>)}
                    </Select>
                    <Button variant="danger" onClick={() => remove(e)}>Remove</Button>
                  </li>
                ))}
              </Card>
            ) : <EmptyState>No employees yet. Create the first one above.</EmptyState>}
          </>
        )}
      </Async>
    </>
  );
}
