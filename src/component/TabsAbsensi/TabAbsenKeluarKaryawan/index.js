import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react'

function TabAbsenKeluarKaryawan ( {
    absensiKeluar
} )
{

    const columns2 = useMemo(
        () => [
            {
                header: 'Tanggal',
                accessorFn: ( row ) => new Date( row.checkout_time ),
                filterVariant: 'date-range',
                Cell: ( { cell } ) => cell.getValue().toLocaleDateString(),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Jam',
                accessorFn: ( row ) => (
                    row.checkout_time.split( 'T' )[ 1 ].split( '.' )[ 0 ]
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Pulang Awal',
                accessorKey: 'early_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },
            {
                header: 'Lembur',
                accessorKey: 'overtime_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },

        ],
        [],
    );

    const table2 = useMantineReactTable( {
        columns: columns2,
        enableDensityToggle: false,
        initialState: { density: 'xs' },
        data: absensiKeluar,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        enableGlobalFilter: false,
        enableColumnResizing: false,
        isMultiSortEvent: () => true,
        mantineTableProps: {
            striped: true,
        },
    } );

    return (
        <div>
            <MantineReactTable
                table={ table2 }
            />
        </div>
    )
}

export default TabAbsenKeluarKaryawan
