import React from "react";
import {useTable} from "@refinedev/react-table";
import {type ColumnDef, flexRender} from "@tanstack/react-table";
import {DateField, DeleteButton, EditButton, List, ShowButton,} from "@refinedev/mantine";

import {Box, Group, Loader, Pagination, ScrollArea, Table,} from "@mantine/core";

import {ColumnFilter, ColumnSorter} from "../../components";
import IEntitlement from "../../interfaces/entitlement";

export const EntitlementList: React.FC = () => {
    const columns = React.useMemo<ColumnDef<IEntitlement>[]>(
        () => [
            {
                id: "actions",
                header: "Actions",
                accessorKey: "id",
                enableColumnFilter: false,
                enableSorting: false,
                cell: function render({getValue}) {
                    return (
                        <Group spacing="xs" noWrap>
                            <ShowButton hideText recordItemId={getValue() as number}/>
                            <EditButton hideText recordItemId={getValue() as number}/>
                            <DeleteButton hideText recordItemId={getValue() as number}/>
                        </Group>
                    );
                },
            },
            {
                id: "name",
                header: "Name",
                accessorKey: "attributes.name",
            },
            {
                id: "code",
                header: "Code",
                accessorKey: "attributes.code",
            },
            {
                "id": "created",
                "header": "Created",
                "accessorKey": "attributes.created",
                cell: function render({getValue}) {
                    return <DateField value={getValue() as string} format="LLL"/>;
                },
            },
            {
                "id": "updated",
                "header": "Updated",
                "accessorKey": "attributes.updated",
                cell: function render({getValue}) {
                    return <DateField value={getValue() as string} format="LLL"/>;
                },
            },
        ],
        [],
    );

    const {
        getHeaderGroups,
        getRowModel,
        setOptions,
        refineCore: {
            setCurrent,
            pageCount,
            current,
            tableQuery: {data: tableData, isLoading },
        },
    } = useTable({
        columns,
    });
    // const categoryIds = tableData?.data?.map((item) => item.category.id) ?? [];
    // const { data: categoriesData } = useMany<ICategory>({
    //   resource: "categories",
    //   ids: categoryIds,
    //   queryOptions: {
    //     enabled: categoryIds.length > 0,
    //   },
    // });

    setOptions((prev) => ({
        ...prev,
        meta: {
            ...prev.meta,
            // categoriesData,
        },
    }));

    if (isLoading) {
        return (
          <ScrollArea>
              <List>
                  <Loader />
              </List>
          </ScrollArea>
    )}

    return (
        <ScrollArea>
            <List>
                <Table highlightOnHover>
                    <thead>
                    {getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th key={header.id}>
                                        {!header.isPlaceholder && (
                                            <Group spacing="xs" noWrap>
                                                <Box>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                </Box>
                                                <Group spacing="xs" noWrap>
                                                    <ColumnSorter column={header.column}/>
                                                    <ColumnFilter column={header.column}/>
                                                </Group>
                                            </Group>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {getRowModel().rows.map((row) => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
                <br/>
                <Pagination
                    position="right"
                    total={pageCount}
                    page={current}
                    onChange={setCurrent}
                />
            </List>
        </ScrollArea>
    );
};
